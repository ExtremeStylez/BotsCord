export interface DiscordBotInfo {
  app_id: string
  username: string
  global_name: string | null
  discriminator: string | null
  avatar: string | null
  guild_count: number
  user_count: number
}

export class DiscordGatewayClient {
  private token: string
  private ws: WebSocket | null = null
  private heartbeatInterval: number | null = null
  private sequence: number | null = null
  private sessionId: string | null = null
  private botInfo: DiscordBotInfo | null = null
  private onLogCallback: ((log: string) => void) | null = null
  private onMessageCallback: ((message: unknown) => void) | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: unknown = null

  constructor(token: string) {
    this.token = token
  }

  setOnLogCallback(callback: (log: string) => void) {
    this.onLogCallback = callback
  }

  setOnMessageCallback(callback: (message: unknown) => void) {
    this.onMessageCallback = callback
  }

  private emitLog(message: string): void {
    if (this.onLogCallback) {
      this.onLogCallback(message)
    }
    console.log(`[DiscordGateway] ${message}`)
  }

  private log(message: string): void {
    this.emitLog(message)
  }

  async fetchBotInfo(): Promise<DiscordBotInfo | null> {
    try {
      this.log("Fetching bot information")
      const botResponse = await fetch("/api/discord/app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token }),
      })

      if (!botResponse.ok) {
        const errorText = await botResponse.text()
        this.log(`Bot info request failed: ${botResponse.status} ${botResponse.statusText}`)
        throw new Error(`Failed to get bot info: ${errorText}`)
      }

      const data = await botResponse.json()
      this.botInfo = data.botInfo
      return this.botInfo
    } catch (error) {
      this.log(`Error fetching bot info: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  async connect(): Promise<void> {
    try {
      // First fetch bot info using our API route
      if (!this.botInfo) {
        await this.fetchBotInfo()
      }

      // Get the gateway URL
      this.log("Fetching gateway URL")
      const gatewayResponse = await fetch("/api/discord/gateway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token }),
      })

      if (!gatewayResponse.ok) {
        const errorText = await gatewayResponse.text()
        this.log(`Gateway request failed: ${gatewayResponse.status} ${gatewayResponse.statusText}`)
        throw new Error(`Failed to get gateway URL: ${errorText}`)
      }

      const gatewayData = await gatewayResponse.json()
      const gatewayUrl = gatewayData.url

      // Connect to the gateway
      this.log(`Connecting to gateway: ${gatewayUrl}`)
      this.ws = new WebSocket(gatewayUrl)

      this.ws.onopen = () => {
        this.log("WebSocket connection established")
        this.reconnectAttempts = 0 // Reset reconnect attempts on successful connection
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleGatewayMessage(data)
        } catch (err) {
          this.log(`Error parsing gateway message: ${err}`)
        }
      }

      this.ws.onerror = (error) => {
        this.log(`WebSocket error: ${error}`)
      }

      this.ws.onclose = (event) => {
        this.log(`WebSocket closed: ${event.code} ${event.reason}`)
        this.clearHeartbeat()

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
          this.log(`Reconnecting in ${delay / 1000} seconds...`)

          this.reconnectTimeout = setTimeout(() => {
            this.reconnectAttempts++
            this.connect()
          }, delay)
        } else {
          this.log("Maximum reconnect attempts reached. Please reconnect manually.")
        }
      }
    } catch (error) {
      this.log(`Error connecting to gateway: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  private handleGatewayMessage(data: unknown | null): void {
    // Store sequence for resuming
    if (data?.s !== null) {
      this.sequence = data?.s
    }

    switch (data?.op) {
      case 10: // Hello
        this.log("Received Hello from gateway")
        // Start heartbeating
        const heartbeatInterval = data?.d?.heartbeat_interval
        this.startHeartbeat(heartbeatInterval)

        // Send identify
        this.identify()
        break

      case 11: // Heartbeat ACK
        this.log("Received Heartbeat ACK")
        break

      case 0: // Dispatch
        this.handleDispatch(data)
        if (data?.t === "READY") {
          this.sessionId = data?.d?.session_id
          this.log(`Session established: ${this.sessionId}`)
        }
        break

      case 9: // Invalid Session
        this.log("Invalid session, reconnecting...")
        setTimeout(() => this.identify(), 5000)
        break

      case 7: // Reconnect
        this.log("Reconnect requested by Discord")
        this.reconnect()
        break

      default:
        this.log(`Received opcode: ${data?.op}`)
    }
  }

  private handleDispatch(data: unknown): void {
    switch (data?.t) {
      case "READY":
        this.log(`Bot is ready! Connected as ${data?.d?.user?.username}`)
        break

      case "GUILD_CREATE":
        this.log(`Connected to guild: ${data?.d?.name}`)
        break

      case "MESSAGE_CREATE":
        this.log(`Message received: ${JSON.stringify(data?.d)}`)
        if (this.onMessageCallback) {
          this.onMessageCallback(data?.d)
        }
        break

      default:
        // Don't log every event to avoid spam
        this.log(`Received event: ${data?.t}`)
    }
  }

  private identify(): void {
    if (!this.ws) return

    this.log("Sending Identify payload")

    const payload = {
      op: 2, // Identify opcode
      d: {
        token: this.token,
        intents: 513, // GUILDS (1 << 0) and GUILD_MESSAGES (1 << 9)
        properties: {
          os: "linux",
          browser: "disco",
          device: "disco",
        },
      },
    }

    this.ws.send(JSON.stringify(payload))
  }

  private startHeartbeat(interval: number): void {
    this.clearHeartbeat()

    this.log(`Starting heartbeat (interval: ${interval}ms)`)

    this.heartbeatInterval = window.setInterval(() => {
      if (!this.ws) return

      this.log("Sending heartbeat")

      const payload = {
        op: 1, // Heartbeat opcode
        d: this.sequence,
      }

      this.ws.send(JSON.stringify(payload))
    }, interval)
  }

  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private reconnect(): void {
    this.disconnect()
    this.connect().catch((error) => {
      this.log(`Reconnection failed: ${error}`)
    })
  }

  disconnect(): void {
    this.log("Disconnecting from Discord")

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    this.clearHeartbeat()

    if (this.ws) {
      this.ws.close(1000, "Normal closure")
      this.ws = null
    }

    this.sequence = null
    this.sessionId = null
    this.log("Disconnected from Discord API")
  }

  // Add a method to update presence

  updatePresence(status: string, activity: unknown = null): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log("Cannot update presence: WebSocket is not connected")
      return
    }

    this.log(`Updating presence: status=${status}, activity=${JSON.stringify(activity)}`)

    const presenceData: unknown = {
      since: null,
      activities: activity ? [activity] : [],
      status: status,
      afk: false,
    }

    const payload = {
      op: 3, // Presence Update opcode
      d: presenceData,
    }

    this.ws.send(JSON.stringify(payload))
    this.log("Presence update sent")
  }
}

"use server"

export async function connectClient(token: string) {
  console.log("Validating Discord token with length:", token.length)

  try {
    // Fetch bot information
    const botResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!botResponse.ok) {
      const errorText = await botResponse.text()
      console.error(`Bot info request failed: ${botResponse.status} ${botResponse.statusText}`)
      console.error(`Error details: ${errorText}`)

      if (botResponse.status === 401) {
        return {
          success: false,
          error: "Invalid token. Please check your Discord bot token and try again.",
        }
      }

      return {
        success: false,
        error: `Failed to get bot info: ${botResponse.status} ${botResponse.statusText}`,
      }
    }

    const botData = await botResponse.json()

    // Fetch guilds
    const guildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!guildsResponse.ok) {
      const errorText = await guildsResponse.text()
      console.error(`Guild request failed: ${guildsResponse.status} ${guildsResponse.statusText}`)
      console.error(`Error details: ${errorText}`)

      return {
        success: false,
        error: `Failed to get guilds: ${guildsResponse.status} ${guildsResponse.statusText}`,
      }
    }

    const guildsData = await guildsResponse.json()
    const estimatedUserCount = guildsData.length * 50 // Rough estimate

    const botInfo = {
      id: botData.id,
      username: botData.username,
      discriminator: botData.discriminator,
      avatar: botData.avatar,
      guildCount: guildsData.length,
      userCount: estimatedUserCount,
    }

    console.log("Successfully validated Discord token")
    console.log("Bot info:", JSON.stringify(botInfo, null, 2))

    return {
      success: true,
      botInfo,
    }
  } catch (error: unknown) {
    console.error("Discord validation error:", error)

    return {
      success: false,
      error: "An unexpected error occurred while validating your token.",
    }
  }
}

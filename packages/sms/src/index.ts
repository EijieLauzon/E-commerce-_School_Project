function getSmsEnv() {
   const apiKey = process.env.SMS_API_KEY
   const number = process.env.SMS_NUMBER

   if (!apiKey || !number) {
      throw new Error(
         'SMS provider is not configured. Set SMS_API_KEY and SMS_NUMBER in your environment.'
      )
   }

   return { apiKey, number }
}

function getSmsTimeoutSignal(timeoutMs = Number(process.env.SMS_FETCH_TIMEOUT_MS ?? '15000')) {
   const controller = new AbortController()
   const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

   return {
      signal: controller.signal,
      cleanup() {
         clearTimeout(timeoutId)
      },
   }
}

async function parseResponseBody(response) {
   const text = await response.text()
   try {
      return JSON.parse(text)
   } catch {
      return text
   }
}

async function sendSmsRequest(url, body, apiKey) {
   const { signal, cleanup } = getSmsTimeoutSignal()

   try {
      const response = await fetch(url, {
         method: 'POST',
         body: JSON.stringify(body),
         headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json',
         },
         signal,
      })

      const responseBody = await parseResponseBody(response)

      if (!response.ok) {
         throw new Error(
            `SMS provider returned ${response.status}: ${
               typeof responseBody === 'string'
                  ? responseBody
                  : JSON.stringify(responseBody)
            }`
         )
      }

      return responseBody
   } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
         throw new Error('SMS provider request timed out. Check your network or SMS API endpoint.')
      }
      throw error
   } finally {
      cleanup()
   }
}

export async function sendBulkSMS({ Mobiles, MessageText }) {
   const { apiKey, number } = getSmsEnv()

   return sendSmsRequest(`https://api.sms.ir/v1/send/bulk`,
      {
         lineNumber: number,
         MessageText,
         Mobiles,
      },
      apiKey
   )
}

export async function sendLikeToLikeSMS({ Mobiles, MessageText }) {
   const { apiKey, number } = getSmsEnv()

   return sendSmsRequest(`https://api.sms.ir/v1/send/likeToLike`,
      {
         lineNumber: number,
         MessageText,
         Mobiles,
      },
      apiKey
   )
}

export async function sendTransactionalSMS({ Mobile, TemplateId, Parameters }) {
   const { apiKey } = getSmsEnv()

   return sendSmsRequest(`https://api.sms.ir/v1/send/verify`,
      {
         TemplateId,
         Mobile,
         Parameters,
      },
      apiKey
   )
}

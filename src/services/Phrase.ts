
const axios = require("axios")

export class PhraseService {

    async getWithWord(word: string): Promise<string> {
        try {
            const response = await axios.get(`${process.env.PHRASE_URL}${word}/examples?includeDuplicates=false&useCanonical=false&limit=1&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e`)
            return response.data.examples[0].text
        } catch(error: any) {
            const code = error.response.data.statusCode
            if (code === 404) {
                return ""
            }
            
            throw new Error(error.response.data.message);
        }
    }

    getAudioUrlThePhrase(phrase: string) {
        const wordToBase4 = Buffer.from(phrase).toString("base64");
        return `${process.env.AUDIO_URL}${wordToBase4}`
    }
}
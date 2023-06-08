import { Logger } from "winston"
import { AudioPlace, Note } from "../entities/Note"
import { UnWordService } from "./Unword"
import { PhraseService } from "./Phrase"
import { TranslateService } from "./Translate"

const axios = require("axios")
const { randomUUID } = require("crypto")

const URL = process.env.ANKI_URL

export class AnkiService {

    constructor(
        private readonly unWordService: UnWordService,
        private readonly phraseService: PhraseService,
        private readonly translateServie: TranslateService,
        private readonly logger: Logger
    ) { }

    async syncronize(deck: string) {
        try {
            this.logger.info("Starting process syncronize words unknow to anki")
            const wordsUnknow = await this.unWordService
                .getWordsUnknow();

            for (let index = 0; index < wordsUnknow.length; index += 1) {
                const word = wordsUnknow[index];
                this.logger.info(`Add word ${word} in deck named ${deck} in anki`)
                const phraseWithWord = await this.phraseService.getWithWord(word)
                const wordInPortuguese = await this.translateServie.englishtoPortuguese(word);
                await this.addNoteInDeck(
                    {
                        deck: deck,
                        front: phraseWithWord,
                        back: wordInPortuguese,
                        audio: {
                            url: this.phraseService.getAudioUrlThePhrase(`${word} ${phraseWithWord}`),
                            place: AudioPlace.FRONT
                        }
                    })
            }

            await this.unWordService.removeWordsUnknow();
            this.logger.info("Finished process syncronize words unknow to anki")
        } catch (error: any) {
            this.logger.error(error.message)
        }
    }

    async addNoteInDeck(note: Note) {
        const hash = randomUUID()
        const response = await axios.post(URL, {
            "action": "addNote",
            "version": 6,
            "params": {
                "note": {
                    "deckName": note.deck,
                    "modelName": "Basic",
                    "fields": {
                        "Front": note.front,
                        "Back": note.back
                    },
                    "audio": [{
                        "url": note.audio.url,
                        "filename": `${hash}.mp3`,
                        "skipHash": hash,
                        "fields": [
                            note.audio.place
                        ]
                    }],
                }
            }
        })

        return response.data;
    }

}
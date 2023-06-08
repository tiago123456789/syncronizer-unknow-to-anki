// @ts-ignore
import translate from "translate-google"

export class TranslateService {

    englishtoPortuguese(word: string) {
        return translate(word, { to: "pt", from: "en" });
    }
}
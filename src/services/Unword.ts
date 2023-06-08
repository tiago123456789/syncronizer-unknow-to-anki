import { Logger } from "winston";
const { GoogleSpreadsheet } = require('google-spreadsheet');
const SHEET_ID = process.env.SHEET_ID
let doc: any | undefined = null;

export class UnWordService {

    constructor(
        private readonly logger: Logger
    ) {}

    async init() {
        if (doc == null) {
            doc = new GoogleSpreadsheet(SHEET_ID);
            await doc.useServiceAccountAuth({
              client_email: process.env.CREDENTIAL_CLIENT_EMAIL,
              // @ts-ignore
              private_key:  process.env.CREDENTIAL_PRIVATE_KEY.replace(/\\n/g, '\n')
            })
            await doc.loadInfo();
        }
    }

    async getWordsUnknow() {
        await this.init();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        return rows.map((item: { [key:string]: any }) => item["WORDS"]);
    }

    async removeWordsUnknow() {
        await this.init();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        if (!rows.length) {
            return;
        }

        for (let index = (rows.length - 1); index >= 0; index -= 1) {
            const item = rows[index];
            this.logger.info(`Removing ${item['WORDS']} the spreadsheet`)
            await item.delete();
        }
    }

}
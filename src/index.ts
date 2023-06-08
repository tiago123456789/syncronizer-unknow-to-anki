require("dotenv").config()
import { AnkiService } from "./services/Anki";
import { PhraseService } from "./services/Phrase";
import { TranslateService } from "./services/Translate";
import { UnWordService } from "./services/Unword"
import logger from "./configs/Logger";
import * as scheduler from "node-schedule"

const { exec } = require("child_process")

const unWordService = new UnWordService(logger)
const phraseService = new PhraseService()
const translateServie = new TranslateService()
const ankiService = new AnkiService(
  unWordService,
  phraseService,
  translateServie,
  logger
)

scheduler.scheduleJob('0 15 * * *', () => {
  exec(`anki &`)
  const deck = process.argv[3]
  
  setTimeout(() => {
    ankiService.syncronize(deck)
  }, 10000)
})


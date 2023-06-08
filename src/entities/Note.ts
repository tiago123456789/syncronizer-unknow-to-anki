
export enum AudioPlace {
    FRONT = "Front",
    BACK = "Back"
}

export class AudioNote {
    url: string = "";
    place: AudioPlace = AudioPlace.FRONT
}

export class Note {
    deck: string = "";
    front: string = "";
    back: string = "";
    audio: AudioNote = new AudioNote()
}
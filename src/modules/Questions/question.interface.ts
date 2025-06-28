export interface Iexplanation{
    text:string,
    img?:string
}

export interface Ioptions{
    label:"A"|"B"|"C"|"D",
    value:string
}



export interface IQuestion{
    topicId:string,
    text:string,
    explanation:Iexplanation,
    options:Ioptions,
    correctAnswer:"A"|"B"|"C"|"D",
}
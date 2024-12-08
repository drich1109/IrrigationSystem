export interface LoggedInUser {
    id:string;
	name: string;
	token: string;
    languageId:string;
}

export type CallResultDto<T> = {
	isSuccess: boolean;
	message: string;
	data: T;
	data2: T;
	totalCount:number | null;
};

export type Languages = 
{
    languageID:number,
    name:string;
    place:string;
    native_name:string,
    description:string
}

export type UserDto = 
{
    name:string;
    email:string;
    password:string;
    languageId:number;
}

export type UserProfileDto = {
    id: number;
    name: string;
    email: string;
    imagePath: string | null;
    vCoin: number;
    currentLanguageId: string;
    totalScoreWeekly: number;
    vcoin: number;
    unitsUnlocked: number | null;
    highestScore: number | null;
    isSubscribed: boolean;
    expirationDate: Date | null;
    weeklyScoreGraph: { [key: string]: number }; 
};
  
export type EditProfileVista = {
    name: string;
    email: string;
    userId: number;
    file: File | null;
};

export type Content = {
    contentID: number;
    contentText: string;
    englishTranslation: string;
    audioPath: string;
    languageID: number;
    contentTypeID: number;
    isActive: boolean;
    isInDictionary:boolean;
};

export type ContentSyllable = {
    id: number;
    contentId: number;
    syllableText: string;
    audioPath: string;
    orderNumber: number;
};

export type ContentExample = {
    id: number;
    contentId: number;
    nativeExample: string;
    englishExample: string;
    orderNumber: number;
};

export type ContentDefinition = {
    id: number;
    contentId: number;
    nativeDefinition: string;
    englishDefinition: string;
    orderNumber: number;
};

export type PowerUp = 
{
    itemID: number;
    itemTypeID: number;
    vcoinPrice: number;
    isPremium: boolean;
    filePath: string;
    isActive: boolean;
    name: string;
    description: string;
}

export type SubscriptionDto = 
{
    id:number;
    subscriptionName:string; 
    price:number;
}

export type CoinBag = 
{
    coinBagId:number;
    quantity:number; 
    moneyPrice:number;
    coinBagName:string;
}


export type Musics = 
{
    itemID: number;
    itemTypeID: number;
    vcoinPrice: number;
    isPremium: boolean;
    filePath: string;
    isActive: boolean;
    musicTitle: string;
    musicGenre: string;
    isAlreadyBought: number;
}

export type SectionDetails = {
    sectionId: number;
    sectionNumber: number;
    title: string;
    isPremium: boolean;
    description: string;
    unitCount:number;
    completedUnitCount:number;
    isAccessible:boolean;
};

export type UnitDetails = {
    unitID: number;
    unitNumber: number;
    title: string;
    description: string;
    totalItems:number;
    totalScore:number;
    totalCorrect:number;
    totalWrong:number;
    isLocked:number;
};

export type QuestionDetails = {
    questionID: number;
    questionText: string;
    imagePath: string | null;
    audioPath: string | null;
    questionTypeID: number;
    unitId: number;
    isActive: boolean;
  
    questionChoiceID: number | null;
    correctChoice: number | null;
    choice1: number | null;
    choice1ContentText: string | null;
    choice1EnglishTranslation: string | null;
    choice1AudioPath: string | null;
    choice2: number | null;
    choice2ContentText: string | null;
    choice2EnglishTranslation: string | null;
    choice2AudioPath: string | null;
    choice3: number | null;
    choice3ContentText: string | null;
    choice3EnglishTranslation: string | null;
    choice3AudioPath: string | null;
    choice4: number | null;
    choice4ContentText: string | null;
    choice4EnglishTranslation: string | null;
    choice4AudioPath: string | null;
  
    questionMatchingTypeID: number | null;
    word1: number | null;
    word1ContentText: string | null;
    word1EnglishTranslation: string | null;
    word1AudioPath: string | null;
    match1: number | null;
    match1ContentText: string | null;
    match1EnglishTranslation: string | null;
    match1AudioPath: string | null;
    word2: number | null;
    word2ContentText: string | null;
    word2EnglishTranslation: string | null;
    word2AudioPath: string | null;
    match2: number | null;
    match2ContentText: string | null;
    match2EnglishTranslation: string | null;
    match2AudioPath: string | null;
    word3: number | null;
    word3ContentText: string | null;
    word3EnglishTranslation: string | null;
    word3AudioPath: string | null;
    match3: number | null;
    match3ContentText: string | null;
    match3EnglishTranslation: string | null;
    match3AudioPath: string | null;
    word4: number | null;
    word4ContentText: string | null;
    word4EnglishTranslation: string | null;
    word4AudioPath: string | null;
    match4: number | null;
    match4ContentText: string | null;
    match4EnglishTranslation: string | null;
    match4AudioPath: string | null;
};

export type UserPowerUp = 
{
    itemId: number;
    userPlayerId: number;
    quantity: number;
    filePath: string;
    name: string;
    description: string;
}

export type GamePlayDto = 
{
    userId: string;
    unitId: number;
    totalCorrectAnswer: number;
    totalScore: number;
    powerUps:PowerUpGameplay[];
}

export type PowerUpGameplay = 
{
    itemId: number;
    quantity: number;
}

export type LeaderBoardDto = 
{
    id:number;
    name: string;
    totalScoreWeekly: number;
    imagePath: string;
}

export type SelfLeaderBoardDto = 
{
    id:number;
    name: string;
    totalScoreWeekly: number;
    imagePath: string;
    userRank:number;
}

export type DailyTaskDto = 
{
    userPlayerID:number;
    taskID: number;
    isCompleted: boolean;
    rewardcoins: number;
    tasktypeId: number;
    taskName: string;
    taskDescription: string;
    isClaimed:boolean;
    totalValue:number;
    currentValue:number
}

export type NotificationsDto = 
{
    id:number;
    message:string;
    isOpened:number;
}

export type PronunciationProgressDto = 
{
    correct:string;
    incorrect: string;
}

export type PronunciationProgressListDto = 
{
    resultId:number;
    contentId:number;
    pronunciationScore: number;
    contentText:string
}

export type PronunciationType = 
{
    numberPronounced:number | null;
}
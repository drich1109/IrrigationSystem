import { getFromBaseApi, getFromMainApi, postToBaseApi, postToMainApi, putFormBaseApi, putFormMainApi, putToBaseApi, putToMainApi } from "../../api/apiService";
import { LoggedInUser, CallResultDto, Languages, UserDto, UserProfileDto, EditProfileVista, Content, ContentDefinition, ContentExample, ContentSyllable, PowerUp, SubscriptionDto, CoinBag, Musics, SectionDetails, UnitDetails, QuestionDetails, UserPowerUp, GamePlayDto, LeaderBoardDto, SelfLeaderBoardDto, DailyTaskDto, NotificationsDto, PronunciationProgressDto, PronunciationProgressListDto, PronunciationType } from "./type";
import CryptoJS from 'crypto-js';
import { VITE_MAIN_API } from '@env';
import { SectionListRenderItem } from "react-native";

const baseUrl = VITE_MAIN_API;

export async function loginUser(email: string, password: string) {
    const hashedPassword = CryptoJS.MD5(password).toString();
    const result = await getFromBaseApi<CallResultDto<LoggedInUser>>('loginVista', { email, hashedPassword });
    return result
}

export async function getLanguages() {
    return await getFromMainApi<CallResultDto<Languages[]>>('getLanguages');
}

export async function register(user: UserDto) {
    return await postToBaseApi<CallResultDto<object>>('registerUser', user)
}

export async function sendCodetoEmail(email: string) {
    return await getFromBaseApi<CallResultDto<object>>('forgotPassword', { email })
}

export async function verifyCode(email: string, code: string) {
    return await getFromBaseApi<CallResultDto<object>>('verifyCode', { email, code })
}

export async function updatePassword(email: string, password: string, currentPassword: string | null) {
    const hashedPassword = CryptoJS.MD5(password).toString();
    let currenthashedPassword;
    if (currentPassword)
        currenthashedPassword = CryptoJS.MD5(currentPassword).toString();
    else currenthashedPassword = null

    return await putToBaseApi<CallResultDto<object>>('changePassword', { email, hashedPassword, currenthashedPassword })
}

export async function getUserLanguage(userID: number) {
    return await getFromMainApi<CallResultDto<Languages>>('getUserLanguage', { userID });
}

export function getUserImageUrl(fileName: string): string {
    const timestamp = Date.now();
    return `${baseUrl}/getUserImage?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserDetails(userID: number) {
    return await getFromMainApi<CallResultDto<UserProfileDto>>('getUserDetails', { userID });
}

export async function getIsEmailUsed(email: string) {
    return await getFromBaseApi<CallResultDto<object>>('isEmailUse', { email });
}

export async function editVistaProfile(formData: FormData) {
    return await putFormBaseApi<CallResultDto<object>>('/editVistaProfile', formData);
}

export async function deactivateVistaAccount(userId: number) {
    return await putToBaseApi<CallResultDto<object>>('/deactivateVistaAccount', { userId });
}

export async function sendFeedback(userId: number, feedback: string) {
    return await postToMainApi<CallResultDto<object>>('/addfeedback', { userId, feedback });
}

export async function sendReport(userId: number, report: string) {
    return await postToMainApi<CallResultDto<object>>('/addreport', { userId, report });
}

export async function getContent(languageId: number, searchString: string, offset: number, LIMIT: number) {
    return await getFromMainApi<CallResultDto<Content[]>>('getContent', { languageId, searchString, offset, LIMIT });
}

export async function getPronunciations(languageId: number, searchString: string, offset: number, LIMIT: number) {
    return await getFromMainApi<CallResultDto<Content[]>>('getContentPronunciation', {languageId,searchString, offset, LIMIT });
}

export async function getContentById(contentId: number) {
    return await getFromMainApi<CallResultDto<Content>>('getContentByID', { contentId });
}

export async function getContentSyllableById(contentId: number) {
    return await getFromMainApi<CallResultDto<ContentSyllable[]>>('getContentSyllableByID', { contentId });
}

export async function getContentExampleById(contentId: number) {
    return await getFromMainApi<CallResultDto<ContentExample[]>>('getContentExampleByID', { contentId });
}

export async function getContentDefinitionById(contentId: number) {
    return await getFromMainApi<CallResultDto<ContentDefinition[]>>('getContentDefinitionByID', { contentId });
}

export function getContentPronunciation(fileName: string): string {
    const timestamp = Date.now();
    return `${baseUrl}/getSoundContentPronunciation?fileName=${fileName}&t=${timestamp}`;
}

export function getSyllablePronunciation(fileName: string): string {
    const timestamp = Date.now();
    return `${baseUrl}/getSyllablePronunciation?fileName=${fileName}&t=${timestamp}`;
}

export async function getPowerUps() {
    return await getFromMainApi<CallResultDto<PowerUp[]>>('getPowerUps');
}

export function getPowerupImage(fileName: string): string {
    const timestamp = Date.now();
    return `${baseUrl}/getItemImage?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserVCoin(userId: string) {
    return await getFromMainApi<CallResultDto<number>>('getUserVcoin', { userId });
}

export async function buyPowerUp(userId: string, itemId: number, quantity: number) {
    return await putToMainApi<CallResultDto<object>>('buyPowerUp', { userId, itemId, quantity });
}

export async function getSubscriptions() {
    return await getFromMainApi<CallResultDto<SubscriptionDto[]>>('getSubscriptions');
}

export async function paymongoRedirect(amount: number, description: string) {
    return await postToMainApi<{ url: string }>('paymongoRedirect', {
        amount,
        description,
    });
}

export async function buySubscription(userId: string, subscriptionId: number) {
    return await postToMainApi<CallResultDto<object>>('buySubscription', {
        userId,
        subscriptionId,
    });
}

export async function getCoinBags() {
    return await getFromMainApi<CallResultDto<CoinBag[]>>('getCoinBags');
}

export async function buyCoinBag(userId: string, coinBagId: number) {
    return await postToMainApi<CallResultDto<object>>('buyCoinBag', {
        userId,
        coinBagId,
    });
}

export async function getMusic() {
    const result = await getFromMainApi<CallResultDto<Musics[]>>('getMusic');
    return result;
}

export async function buyMusic(userId: string, itemId: number, quantity: number) {
    return await putToMainApi<CallResultDto<object>>('buyMusic', { userId, itemId, quantity });
}

export function getBackgroundMusic(fileName: string): string {
    const timestamp = Date.now();
    return `${baseUrl}/getBackgroundMusic?fileName=${fileName}&t=${timestamp}`;
}

export async function getSections(userId: number, languageId: number) {
    return await getFromMainApi<CallResultDto<SectionDetails[]>>('getSections', { userId, languageId });
}

export async function getUnits(sectionId: number, userId: string | null) {
    return await getFromMainApi<CallResultDto<UnitDetails[]>>('getUnits', { sectionId, userId });
}

export async function getUnitQuestions(unitId: number) {
    return await getFromMainApi<CallResultDto<QuestionDetails[]>>('getUnitQuestions', { unitId });
}

export function getQuestionFiles(fileName: string): string {
    const timestamp = Date.now();
    return `${baseUrl}/getQuestionFiles?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserPowerUps(userID: string) {
    return await getFromMainApi<CallResultDto<UserPowerUp[]>>('getUserPowerUp', { userID });
}

export async function saveGamePlay(gamePlay: GamePlayDto) {
    const formData = new FormData();

    formData.append('userId', gamePlay.userId.toString());
    formData.append('unitId', gamePlay.unitId.toString());
    formData.append('totalCorrectAnswer', gamePlay.totalCorrectAnswer.toString());
    formData.append('totalScore', gamePlay.totalScore.toString());
    formData.append('powerUps', JSON.stringify(gamePlay.powerUps));
    return await putFormMainApi<CallResultDto<number>>('saveGamePlay', formData);
}

export async function getLeaderBoards() {
    return await getFromMainApi<CallResultDto<LeaderBoardDto[]>>('getLeaderBoards');
}

export async function updateScore(userId: string, score: number) {
    return await putToMainApi<CallResultDto<object>>('updateDailyScore', { userId, score });
}

export async function reActivateVista(email: string) {
    return await putToBaseApi<CallResultDto<object>>('reActivateVista', { email });
}

export async function getSelfRank(userId: number) {
    return await getFromMainApi<CallResultDto<SelfLeaderBoardDto>>('getSelfRank', { userId });
}

export async function getSelfRankAllTime(userId: number) {
    return await getFromMainApi<CallResultDto<SelfLeaderBoardDto>>('getSelfRankAllTime', { userId });
}

export async function getLeaderBoardsAllTime() {
    return await getFromMainApi<CallResultDto<LeaderBoardDto[]>>('getLeaderBoardsAllTime');
}

export async function addrating(userId: number, rating: number) {
    return await postToMainApi<CallResultDto<object>>('addRating', { userId, rating });
}

export async function getDailyTasks(userId: number) {
    return await getFromMainApi<CallResultDto<DailyTaskDto[]>>('getDailyTasks', { userId });
}

export async function claimReward(userId: string, taskId: number) {
    return await putToMainApi<CallResultDto<object>>('claimReward', { userId, taskId });
}

export async function getNotifications(userId: number) {
    return await getFromMainApi<CallResultDto<NotificationsDto[]>>('getNotifications', { userId });
}

export async function updateNotifications(userId: string) {
    return await putToMainApi<CallResultDto<object>>('updateNotifications', { userId });
}

export async function checkPronunciation(formData: FormData) {
    return await putFormMainApi<CallResultDto<object>>('checkPronunciation', formData);
}

export async function pronunciationProgressChart(userId: number, contentId: number | null) {
    return await getFromMainApi<CallResultDto<PronunciationProgressDto>>('getPronunciationProgress', { userId, contentId });
}

export async function pronunciationProgressList(userId: number, contentId: number | null) {
    return await getFromMainApi<CallResultDto<PronunciationProgressListDto[]>>('getPronunciationList', { userId, contentId });
}

export async function getPronunciationCount(userId: number) {
    return await getFromMainApi<CallResultDto<PronunciationType>>('getPronunciationCount', { userId });
}

export async function updateUserLanguage(userId: string, languageId:number) {
    return await putToMainApi<CallResultDto<object>>('updateUserLanguage', { userId, languageId });
}

export async function poolSubscription(userId: number) {
    return await getFromMainApi<CallResultDto<boolean>>('poolSubscription', { userId });
}

export async function poolCoinBag(userId: number, vCoin:number) {
    return await getFromMainApi<CallResultDto<boolean>>('poolCoinBag', { userId, vCoin });
}
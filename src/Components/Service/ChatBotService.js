import { PrivateHttp } from "./axios-helper";
class ChatBotService {
getChats(){
  return PrivateHttp.get(`/helpDesk/fetchChatHistory`)
}
createChat(message){
  return PrivateHttp.post(`/helpDesk/createChat`,message)
}
clearChat(){
  return PrivateHttp.delete(`/helpDesk/clearChat`)
}
}export default new ChatBotService()
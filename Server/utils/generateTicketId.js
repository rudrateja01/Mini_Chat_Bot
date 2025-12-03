import { v4 as uuidv4 } from "uuid";

const generateTicketId = () =>{
  const uid = uuidv4().split("-")[0].toUpperCase();
  const ts = Date.now().toString().slice(-5);
  return `RTG-${ts}-${uid}`;
}

export default generateTicketId;

import emailQueue from "./email.queue.js"; 
 
export async function queueEmail({ 
  to, 
  subject, 
  text, 
  html, 
}) { 
  return emailQueue.add( 
    "send-email", 
    { 
      to, 
      subject, 
      text, 
      html, 
    }, 
    { 
      attempts: 3, 
 
      backoff: { 
        type: "exponential", 
        delay: 5000, 
      }, 
 
      removeOnComplete: 100, 
 
      removeOnFail: 500, 
    } 
  ); 
}
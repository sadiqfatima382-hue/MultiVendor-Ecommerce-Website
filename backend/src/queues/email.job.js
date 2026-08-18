// import emailQueue from "./email.queue.js"; 
 
// export async function queueEmail({ 
//   type,
//   to, 
//   subject, 
//   text, 
//   html, 
// }) { 
//   return emailQueue.add( 
//     "send-email", 
//     { 
//       type,
//       to, 
//       subject, 
//       text, 
//       html, 
//     }, 
//     { 
//       attempts: 3, 
 
//       backoff: { 
//         type: "exponential", 
//         delay: 5000, 
//       }, 
 
//       removeOnComplete: 100, 
 
//       removeOnFail: 500, 
//     } 
//   ); 
// }

import emailQueue from "./email.queue.js";

export async function queueEmail({
  type,
  to,
  name,
  orderNumber,
  grandTotal,
  resetUrl,
  otp,
}) {
  const job = await emailQueue.add(
    "send-email",
    {
      type,
      to,
      name,
      orderNumber,
      grandTotal,
      resetUrl,
      otp,
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

  console.log(
    `📨 Email job added: ${job.id} (${type})`
  );

  return job;
}
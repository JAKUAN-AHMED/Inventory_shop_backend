import { prisma } from '../../prisma/client';
import { sendEmail } from '../../utils/sendEmail';
import { Icontact } from './contact.interface';

const contact = async (contactInfo : Icontact) => {
  // return await sendEmail(
  //   [{ email: 'azizultushar98@gmail.com' }],
  //   subject,
  //   htmlContent,
  // );


  const result = await prisma.contactUs.create({
    data:{
      ...contactInfo,
    }
  });
  

  return result;
};

export const ConatactService = { contact };

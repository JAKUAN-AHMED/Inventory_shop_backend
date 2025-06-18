import { sendEmail } from '../../utils/sendEmail';
import { Icontact } from './contact.interface';

const contact = async (contactInfo : Icontact,htmlContent:any) => {

  const {email,name}=contactInfo;
  const subject:string=`Message From ${name}`;
  return await sendEmail(
    [{ email}],
    subject,
    htmlContent,
  );
};

export const ConatactService = { contact };

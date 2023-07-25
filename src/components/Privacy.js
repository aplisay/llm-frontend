import * as React from 'react';
import Box from '@mui/joy/Box';
import image from '../assets/privacy.jpg';
import RightImagePage, { Typography, ListItemText } from './RightImagePage';
import JoyTypography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { ArrowForward } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from '@mui/joy/Grid';
import Link from '@mui/joy/Link';
import { List, ListItem } from '@mui/joy';


export default function Privacy() {
  return (
    <RightImagePage image={image} alt="Footsteps in the sand"
      sx={{
        my: 'auto',
        py: 2,
        pb: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 400,
        maxWidth: '100%',
        mx: 'auto',
        borderRadius: 'sm',
        '& form': {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        },
      }}
    >

      <Typography level="title">
        Legal terms of use for this site and privacy policy
      </Typography>
      <Typography level="heading">Site operator and data controller</Typography>

      <Typography level="body">
        This website, the service and associated communication mechanisms are operated by Aplisay Ltd of 86-90 Paul Street, London, England, EC2A 4NE.<br />
        All information on this site is Copyright 2023 Aplisay Limited unless otherwise noted.
      </Typography>
      <Typography level="heading">
        Terms of Use for this Service
      </Typography>
      <Typography level="body">
        The following terms and conditions govern your use of the service, and all of its features. It also covers all of the information contained in, or available through this website and service.
        By accessing this website and creating a user on the site, or authenticating using an external service, to access the site and any of its services you agree to be bound by these terms and conditions.
      </Typography>
      <Typography level="h2">Fitness for Purpose</Typography>
      <Typography level="body">
        This is an experimental AI service designed for prototyping and feasibility testing only.
        We do not warrant or represent that the service, information operation and any data contained therein is accurate, current, complete or suitable for any particular purpose.
        Taking into account the fact that the service is experimental in nature and access is provided without charge,
        we will not be liable to users of this service for any losses or damages, whether direct, indirect, special or consequential where in contract, tort or otherwise arising from this website or any linked websites
        for whatever reason (excluding death and personal injury caused by negligence on the part of the Company).
      </Typography>
      <Typography level="h2">Confidentiality and Security</Typography>
      <Typography level="body">
        Because of it's status as an experimental service which makes use of other vendors' experimental services, you must not process production data using the service.
        You must only use the service to conduct test transactions which have no value and warrant that you will not cause or allow any
        commercially valuable, secret, or personal information to be processed via the service. It is a condition of using the service that you indemnify us against claims by any third party, which arise from
        your processing any proprietary or personal data using of this service.
      </Typography>
      <Typography level="body">
        Your use of the service must be reasonable and consistent with small quantities of testing to evaluate the feasibility of the technology behind it. In particular you agree that you will not:
        <List>
          <ListItemText>Subject the service to large amounts of traffic which are inconsistent with simple experimentation - for the avoidance of doubt we consider reasonable usage to be no more than 2 concurrent calls, and no more than 120 minutes of total call duration per day over a period of up to a week.</ListItemText>
          <ListItemText>Cause or allow an interaction with any human caller who is not part of your internal testing team and fully aware of the nature of the service.</ListItemText>
          <ListItemText>Use the service to place outbound calls, or connect the service to an outbound call to a human through any third party contrivance.</ListItemText>
          <ListItemText>Undertake non-serious prank calls or other uses of the technology which are not good faith technical prototyping and exploration. If in any doubt about the acceptability of testing, please consult us before proceeeding.</ListItemText>
        </List>
        We may monitor the service, data submitted, and transcripts of sessions to detect abuse, correct defects, and improve the service. We will not however:
        <List>
          <ListItemText>Disclose your uploaded identifiable data and transcripts verbatim either publicly or to any other third party without your permission. We may however process and disclose unattributed general patterns in data and their effects on the service to improve it and understanding of it.</ListItemText>
          <ListItemText>Use your data verbatim to train any model or engine.</ListItemText>
        </List>

      </Typography>
      <Typography level="body">
        Your use of this service is governed by English law and the English courts shall have exclusive jurisdiction over any disputes arising from or in connection with the use, misuse or inability to use this website.
      </Typography>

      <Typography level="heading">Privacy Policy</Typography>
      <Typography level="body">
        This Privacy Poilcy details how we use your own personal information that you provide to us in order to access the service; principally your name and contact details which you provide in order to
        gain access to the service and any further personally identifiable information which you provide to us in interactions with us about your use of the service. It does not cover test data that you
        enter into the system as you warrant under the terms of service that none of this is personal information.
      </Typography>
      <Typography level="h2">Information Collection and Purpose</Typography>
      <Typography level="body">We may process the following categories of personal data about you:
        <List>
          <ListItemText>Communication Data that includes any communication that you send to us whether that be through the contact form on our website, through email, text, social media messaging, social media posting or any other communication that you send us.</ListItemText>
          <ListItemText>Name, email address, telephone numbers, and identities on third party systems that you use to cross authenticate onto our systems.</ListItemText>
        </List>
        We process this data for the purposes of verifying your identity and communicating with you; replying to your queries, managing our business relationship, and keeping you informed about products and services you sign up for or expressly enquire about.
        </Typography>
      <Typography level="body">
        Our lawful ground for this processing is our legitimate interests which in this case are to reply to communications sent to us, to keep records and administer our communication with you, and technically administering our systems.
      </Typography>


      <Typography level="h2">Sharing Your Information</Typography>
      <Typography level="body">
        We only share your personal data with the parties set out below:
        <List>
          <ListItemText>Professional advisers including legal advisors, bankers and auditors.</ListItemText>
          <ListItemText>Our IT service providers as data processors.</ListItemText>
          <ListItemText>Where we are required to do so by law.</ListItemText>
        </List>

      </Typography>
      <Typography level="body">
        Your data will not be used for any other purpose unrelated to running this service and managing your relationship with us by Aplisay Ltd, nor will we give, sell or lease your information to third parties for any purpose not stated above.
      </Typography>
      <Typography level="body">
        We have put in place security measures to prevent your personal data from being accidentally lost, used, altered, disclosed, or accessed without authorisation.<br/>
        We also allow access to your personal data only to those employees and partners who have a business need to know such data.<br />
        They will only process your personal data on our instructions and they must keep it confidential.<br />
        We have procedures in place to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach if we are legally required to.<br />
      </Typography>

      <Typography level="heading">Data Retention</Typography>
      <Typography level="body">
        We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
      </Typography>

      <Typography level="heading">Your Legal Rights</Typography>

      <Typography level="body">
        Under data protection laws you have rights in relation to your personal data that include the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and(where the lawful ground of processing is consent) to withdraw consent.You can see more about these rights at: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/individual-rights/
      </Typography>
      <Typography level="body">
        If you wish to exercise any of the rights set out above, please email us at hello@aplisay.uk.<br />
        You will not have to pay a fee to access your personal data (or to exercise any of the other rights), however, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive or refuse to comply with your request in these circumstances.
      </Typography>
      <Typography level="body">
        We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data (or to exercise any of your other rights). This is a security measure to ensure that personal data is not disclosed to any person who has no right to receive it.
        We may also contact you to ask you for further information in relation to your request to speed up our response.We try to respond to all legitimate requests within one month. Occasionally it may take us longer than a month if your request is particularly complex or you have made a number of requests.
        In this case, we will notify you. If you are not happy with any aspect of how we collect and use your data, you have the right to complain to the Information Commissioner’s Office (ICO), the UK supervisory authority for data protection issues (www.ico.org.uk).
        We should be grateful if you would contact us first if you do have a complaint so that we can try to resolve it for you.
      </Typography>

      <Typography level="heading">Third Party Links</Typography>
      <Typography level="body">This website may include links to third - party websites, plug-ins and applications.
        Clicking on those links or otherwise connecting to those services may allow third parties to collect or share data about you.We do not control these third - party websites and are not responsible for their privacy statements.
        When you leave our website, we encourage you to read the privacy notice of every website you visit.
      </Typography>



    </RightImagePage >
  );
}

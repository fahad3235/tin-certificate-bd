// e-TIN Guide BD — content (facts, guides, checklists, situations, quiz).
// Every string carries en + bn. Facts verified 2026-11-10 (see DATA_NOTES.md).
(function (root) {
  'use strict';

  var FACTS = [
    { en: 'Issued by: National Board of Revenue (NBR)', bn: 'ইস্যুকারী: জাতীয় রাজস্ব বোর্ড (এনবিআর)' },
    { en: 'Official portal: secure.incometax.gov.bd', bn: 'সরকারি পোর্টাল: secure.incometax.gov.bd' },
    { en: 'Registration fee: Free', bn: 'রেজিস্ট্রেশন ফি: বিনামূল্যে' },
    { en: 'e-TIN: 12 digits', bn: 'ই-টিআইএন: ১২ সংখ্যার' },
    { en: 'Helpline: 16555', bn: 'হেল্পলাইন: ১৬৫৫৫' },
    { en: 'Typical time: 15–30 minutes', bn: 'সম্ভাব্য সময়: ১৫–৩০ মিনিট' }
  ];

  var WHAT = [
    {
      en: 'A TIN (Taxpayer Identification Number) is the 12-digit number the National Board of Revenue (NBR) gives you so your tax payments and returns can be tracked. Since 2013 it is issued online as an e-TIN — you apply on the NBR portal, your NID is checked against the Election Commission database, and your certificate PDF is ready to download in seconds.',
      bn: 'টিআইএন (করদাতা শনাক্তকরণ নম্বর) হলো জাতীয় রাজস্ব বোর্ড (এনবিআর) থেকে দেওয়া ১২ সংখ্যার একটি নম্বর, যার মাধ্যমে আপনার কর পরিশোধ ও রিটার্ন শনাক্ত করা হয়। ২০১৩ সাল থেকে এটি অনলাইনে ই-টিআইএন হিসেবে দেওয়া হয় — আপনি এনবিআর পোর্টালে আবেদন করবেন, আপনার এনআইডি নির্বাচন কমিশনের তথ্যভান্ডারের সঙ্গে মিলিয়ে দেখা হবে, এবং কয়েক সেকেন্ডের মধ্যে আপনার সার্টিফিকেটের পিডিএফ ডাউনলোডের জন্য তৈরি হয়ে যাবে।'
    },
    {
      en: 'Registration itself is free — NBR has not authorised anyone to charge for it. If someone asks you for money to “arrange” a TIN, walk away: the whole process is designed to be done by you, from your own phone, in about half an hour.',
      bn: 'রেজিস্ট্রেশন সম্পূর্ণ বিনামূল্যে — এর জন্য কাউকে টাকা দেওয়ার অনুমতি এনবিআর দেয়নি। কেউ টিআইএন “করে দেওয়ার” বিনিময়ে টাকা চাইলে সরে আসুন: পুরো প্রক্রিয়াটি আপনি নিজেই নিজের ফোন থেকে প্রায় আধা ঘণ্টায় করতে পারবেন।'
    }
  ];

  var GUIDES = [
    {
      id: 'individual',
      title: { en: 'Individual e-TIN (personal)', bn: 'ব্যক্তিগত ই-টিআইএন' },
      time: { en: '15–30 minutes with documents ready', bn: 'কাগজপত্র প্রস্তুত থাকলে ১৫–৩০ মিনিট' },
      steps: [
        { id: 'ind-1', title: { en: 'Gather your NID, mobile and email', bn: 'এনআইডি, মোবাইল ও ইমেইল প্রস্তুত রাখুন' }, detail: { en: 'Keep your NID number (10 or 17 digits), an active mobile number and a valid email address ready. You will also need your parents\u2019 names exactly as on your NID.', bn: 'আপনার এনআইডি নম্বর (১০ বা ১৭ সংখ্যার), একটি সক্রিয় মোবাইল নম্বর ও একটি বৈধ ইমেইল ঠিকানা হাতের কাছে রাখুন। এনআইডিতে যেভাবে লেখা আছে, হুবহু সেভাবে আপনার বাবা-মায়ের নামও লাগবে।' } },
        { id: 'ind-2', title: { en: 'Open the official e-TIN portal', bn: 'সরকারি ই-টিআইএন পোর্টাল খুলুন' }, detail: { en: 'Go to secure.incometax.gov.bd and open TINHome. Use only the official NBR portal — never pay a broker or use a middleman site.', bn: 'secure.incometax.gov.bd-এ গিয়ে TINHome খুলুন। শুধুমাত্র এনবিআরের সরকারি পোর্টাল ব্যবহার করুন — কোনো দালালকে টাকা দেবেন না বা মধ্যস্বত্বভোগী সাইট ব্যবহার করবেন না।' } },
        { id: 'ind-3', title: { en: 'Create your account', bn: 'আপনার অ্যাকাউন্ট তৈরি করুন' }, detail: { en: 'Choose Register. Pick a user ID of at least 6 characters, a strong password and a security question, then enter your mobile number and email address.', bn: 'Register-এ ক্লিক করুন। কমপক্ষে ৬ অক্ষরের একটি ইউজার আইডি, একটি শক্তিশালী পাসওয়ার্ড ও একটি নিরাপত্তা প্রশ্ন বেছে নিন, তারপর আপনার মোবাইল নম্বর ও ইমেইল ঠিকানা লিখুন।' } },
        { id: 'ind-4', title: { en: 'Activate with the OTPs', bn: 'ওটিপি দিয়ে অ্যাকাউন্ট সক্রিয় করুন' }, detail: { en: 'NBR sends a one-time code to your phone and another to your email. Enter both codes to activate your account.', bn: 'এনবিআর আপনার ফোনে একটি ও আপনার ইমেইলে আরেকটি এককালীন কোড (ওটিপি) পাঠাবে। অ্যাকাউন্ট সক্রিয় করতে দুটি কোডই লিখুন।' } },
        { id: 'ind-5', title: { en: 'Log in and choose Individual TIN', bn: 'লগইন করে ব্যক্তিগত টিআইএন বেছে নিন' }, detail: { en: 'Log in with your new user ID and password, then select the individual (personal) TIN application.', bn: 'নতুন ইউজার আইডি ও পাসওয়ার্ড দিয়ে লগইন করুন, তারপর ব্যক্তিগত টিআইএন আবেদনটি বেছে নিন।' } },
        { id: 'ind-6', title: { en: 'Fill in the form exactly as your NID', bn: 'ফরমটি এনআইডি অনুযায়ী হুবহু পূরণ করুন' }, detail: { en: 'Enter your name, parents\u2019 names, date of birth, present and permanent addresses with postcode, and your source of income. Spelling must match your NID.', bn: 'আপনার নাম, বাবা-মায়ের নাম, জন্মতারিখ, পোস্টকোডসহ বর্তমান ও স্থায়ী ঠিকানা এবং আয়ের উৎস লিখুন। বানান অবশ্যই এনআইডির সঙ্গে মিলতে হবে।' } },
        { id: 'ind-7', title: { en: 'Submit and download your certificate', bn: 'জমা দিন ও সার্টিফিকেট ডাউনলোড করুন' }, detail: { en: 'The system checks your NID against the Election Commission database. On a match, your 12-digit e-TIN certificate PDF is ready to download in seconds — free of charge.', bn: 'সিস্টেম আপনার এনআইডি নির্বাচন কমিশনের তথ্যভান্ডারের সঙ্গে মিলিয়ে দেখবে। মিলে গেলে কয়েক সেকেন্ডের মধ্যে আপনার ১২ সংখ্যার ই-টিআইএন সার্টিফিকেটের পিডিএফ ডাউনলোডের জন্য তৈরি হয়ে যাবে — সম্পূর্ণ বিনামূল্যে।' } }
      ]
    },
    {
      id: 'business',
      title: { en: 'Business / company e-TIN', bn: 'ব্যবসা / কোম্পানির ই-টিআইএন' },
      time: { en: '20–40 minutes with documents ready', bn: 'কাগজপত্র প্রস্তুত থাকলে ২০–৪০ মিনিট' },
      steps: [
        { id: 'bus-1', title: { en: 'Gather your business papers', bn: 'ব্যবসার কাগজপত্র সংগ্রহ করুন' }, detail: { en: 'Trade licence for a proprietorship; for a company, the RJSC certificate of incorporation plus the Memorandum and Articles of Association. Also keep bank account details ready.', bn: 'একক মালিকানার ব্যবসার জন্য ট্রেড লাইসেন্স; কোম্পানির জন্য আরজেএসসি থেকে পাওয়া নিবন্ধন সনদ (সার্টিফিকেট অব ইনকরপোরেশন) এবং মেমোরেন্ডাম ও আর্টিকেলস অব অ্যাসোসিয়েশন। ব্যাংক অ্যাকাউন্টের তথ্যও হাতের কাছে রাখুন।' } },
        { id: 'bus-2', title: { en: 'Open the official e-TIN portal', bn: 'সরকারি ই-টিআইএন পোর্টাল খুলুন' }, detail: { en: 'Go to secure.incometax.gov.bd and open TINHome. Use only the official NBR portal — never pay a broker or use a middleman site.', bn: 'secure.incometax.gov.bd-এ গিয়ে TINHome খুলুন। শুধুমাত্র এনবিআরের সরকারি পোর্টাল ব্যবহার করুন — কোনো দালালকে টাকা দেবেন না বা মধ্যস্বত্বভোগী সাইট ব্যবহার করবেন না।' } },
        { id: 'bus-3', title: { en: 'Create and activate your account', bn: 'অ্যাকাউন্ট তৈরি করে সক্রিয় করুন' }, detail: { en: 'Register with a user ID, password, security question, mobile and email, then enter the OTPs sent to your phone and email.', bn: 'ইউজার আইডি, পাসওয়ার্ড, নিরাপত্তা প্রশ্ন, মোবাইল ও ইমেইল দিয়ে রেজিস্টার করুন, তারপর ফোন ও ইমেইলে পাঠানো ওটিপি লিখে অ্যাকাউন্ট সক্রিয় করুন।' } },
        { id: 'bus-4', title: { en: 'Choose the business TIN application', bn: 'ব্যবসার টিআইএন আবেদন বেছে নিন' }, detail: { en: 'Log in and select the TIN application for a business, firm or company.', bn: 'লগইন করে ব্যবসা, ফার্ম বা কোম্পানির টিআইএন আবেদনটি বেছে নিন।' } },
        { id: 'bus-5', title: { en: 'Fill in the business details', bn: 'ব্যবসার তথ্য পূরণ করুন' }, detail: { en: 'Enter the business name, address, type of business and income source. For firms and companies, enter the proprietors\u2019, partners\u2019 or directors\u2019 names and their TINs where asked.', bn: 'ব্যবসার নাম, ঠিকানা, ব্যবসার ধরন ও আয়ের উৎস লিখুন। ফার্ম ও কোম্পানির ক্ষেত্রে যেখানে চাওয়া হবে, সেখানে মালিক, অংশীদার বা পরিচালকদের নাম ও তাঁদের টিআইএন লিখুন।' } },
        { id: 'bus-6', title: { en: 'Submit and download your certificate', bn: 'জমা দিন ও সার্টিফিকেট ডাউনলোড করুন' }, detail: { en: 'After verification, download the 12-digit e-TIN certificate PDF for the business and keep a printed copy with your trade licence.', bn: 'যাচাই শেষে ব্যবসার ১২ সংখ্যার ই-টিআইএন সার্টিফিকেটের পিডিএফ ডাউনলোড করুন এবং একটি ছাপানো কপি আপনার ট্রেড লাইসেন্সের সঙ্গে রাখুন।' } }
      ]
    }
  ];

  var CHECKLISTS = [
    {
      id: 'individual',
      title: { en: 'Individual — documents to have ready', bn: 'ব্যক্তিগত — যা যা প্রস্তুত রাখবেন' },
      items: [
        { id: 'ind-doc-1', text: { en: 'NID card (10 or 17-digit number)', bn: 'এনআইডি কার্ড (১০ বা ১৭ সংখ্যার নম্বর)' } },
        { id: 'ind-doc-2', text: { en: 'Active mobile number (for OTP)', bn: 'সক্রিয় মোবাইল নম্বর (ওটিপির জন্য)' } },
        { id: 'ind-doc-3', text: { en: 'Valid email address (for OTP + certificate)', bn: 'বৈধ ইমেইল ঠিকানা (ওটিপি ও সার্টিফিকেটের জন্য)' } },
        { id: 'ind-doc-4', text: { en: 'Father\u2019s and mother\u2019s names as on NID', bn: 'এনআইডি অনুযায়ী বাবা-মায়ের নাম' } },
        { id: 'ind-doc-5', text: { en: 'Present and permanent address with postcode', bn: 'পোস্টকোডসহ বর্তমান ও স্থায়ী ঠিকানা' } },
        { id: 'ind-doc-6', text: { en: 'Source of income (salary, business, profession…)', bn: 'আয়ের উৎস (বেতন, ব্যবসা, পেশা…)' } }
      ]
    },
    {
      id: 'business',
      title: { en: 'Business — documents to have ready', bn: 'ব্যবসা — যা যা প্রস্তুত রাখবেন' },
      items: [
        { id: 'bus-doc-1', text: { en: 'Trade licence (valid and up to date)', bn: 'ট্রেড লাইসেন্স (বৈধ ও হালনাগাদ)' } },
        { id: 'bus-doc-2', text: { en: 'Certificate of incorporation from RJSC (companies)', bn: 'আরজেএসসি থেকে নিবন্ধন সনদ (কোম্পানির ক্ষেত্রে)' } },
        { id: 'bus-doc-3', text: { en: 'Memorandum + Articles of Association (companies)', bn: 'মেমোরেন্ডাম ও আর্টিকেলস অব অ্যাসোসিয়েশন (কোম্পানির ক্ষেত্রে)' } },
        { id: 'bus-doc-4', text: { en: 'Bank account details / solvency certificate', bn: 'ব্যাংক অ্যাকাউন্টের তথ্য / সলভেন্সি সার্টিফিকেট' } },
        { id: 'bus-doc-5', text: { en: 'Proprietor / partner / director names and TINs', bn: 'মালিক / অংশীদার / পরিচালকদের নাম ও টিআইএন' } },
        { id: 'bus-doc-6', text: { en: 'Business address with postcode', bn: 'পোস্টকোডসহ ব্যবসার ঠিকানা' } }
      ]
    },
    {
      id: 'after',
      title: { en: 'After you get your TIN', bn: 'টিআইএন পাওয়ার পর যা করবেন' },
      items: [
        { id: 'aft-1', text: { en: 'Download and save the e-TIN certificate PDF', bn: 'ই-টিআইএন সার্টিফিকেটের পিডিএফ ডাউনলোড করে সংরক্ষণ করুন' } },
        { id: 'aft-2', text: { en: 'Print a copy and keep it with your NID', bn: 'একটি কপি ছাপিয়ে এনআইডির সঙ্গে রাখুন' } },
        { id: 'aft-3', text: { en: 'Write down your 12-digit TIN somewhere safe', bn: '১২ সংখ্যার টিআইএনটি নিরাপদ জায়গায় লিখে রাখুন' } },
        { id: 'aft-4', text: { en: 'File your income-tax return through the eTax portal when due', bn: 'সময়মতো ই-ট্যাক্স পোর্টালে আয়কর রিটার্ন জমা দিন' } },
        { id: 'aft-5', text: { en: 'Keep your portal password safe — never share your OTP', bn: 'পোর্টালের পাসওয়ার্ড নিরাপদে রাখুন — কাউকে ওটিপি দেবেন না' } }
      ]
    }
  ];

  var NEED_SITUATIONS = [
    { id: 'need-1', text: { en: 'I have a salaried job', bn: 'আমার বেতনভুক্ত চাকরি আছে' } },
    { id: 'need-2', text: { en: 'I run a business or need a trade licence', bn: 'আমি ব্যবসা করি বা ট্রেড লাইসেন্স দরকার' } },
    { id: 'need-3', text: { en: 'I want to open a bank account', bn: 'আমি ব্যাংক অ্যাকাউন্ট খুলতে চাই' } },
    { id: 'need-4', text: { en: 'I am applying for a passport', bn: 'আমি পাসপোর্টের আবেদন করছি' } },
    { id: 'need-5', text: { en: 'I want to register a car', bn: 'আমি গাড়ি নিবন্ধন করতে চাই' } },
    { id: 'need-6', text: { en: 'I want to register land or a flat', bn: 'আমি জমি বা ফ্ল্যাট নিবন্ধন করতে চাই' } },
    { id: 'need-7', text: { en: 'I import or export goods', bn: 'আমি পণ্য আমদানি বা রপ্তানি করি' } },
    { id: 'need-8', text: { en: 'I am a company director or partner', bn: 'আমি কোম্পানির পরিচালক বা অংশীদার' } }
  ];

  var QUIZ = [
    { id: 'q1', q: { en: 'Which authority issues the e-TIN in Bangladesh?', bn: 'বাংলাদেশে ই-টিআইএন কে দেয়?' }, options: [
      { en: 'National Board of Revenue (NBR)', bn: 'জাতীয় রাজস্ব বোর্ড (এনবিআর)' },
      { en: 'Election Commission', bn: 'নির্বাচন কমিশন' },
      { en: 'Bangladesh Bank', bn: 'বাংলাদেশ ব্যাংক' },
      { en: 'City Corporation', bn: 'সিটি করপোরেশন' } ], answer: 0,
      why: { en: 'NBR is the apex tax authority and runs the e-TIN portal.', bn: 'এনবিআর দেশের সর্বোচ্চ কর কর্তৃপক্ষ এবং ই-টিআইএন পোর্টাল পরিচালনা করে।' } },
    { id: 'q2', q: { en: 'How much does e-TIN registration cost?', bn: 'ই-টিআইএন রেজিস্ট্রেশন করতে কত টাকা লাগে?' }, options: [
      { en: '৳500', bn: '৫০০ টাকা' },
      { en: '৳1,000', bn: '১,০০০ টাকা' },
      { en: 'Free', bn: 'বিনামূল্যে' },
      { en: '৳100 per year', bn: 'বছরে ১০০ টাকা' } ], answer: 2,
      why: { en: 'NBR has kept e-TIN registration completely free of charge.', bn: 'এনবিআর ই-টিআইএন রেজিস্ট্রেশন সম্পূর্ণ বিনামূল্যে রেখেছে।' } },
    { id: 'q3', q: { en: 'How many digits does an e-TIN have?', bn: 'একটি ই-টিআইএনে কয়টি সংখ্যা থাকে?' }, options: [
      { en: '10', bn: '১০' },
      { en: '11', bn: '১১' },
      { en: '12', bn: '১২' },
      { en: '17', bn: '১৭' } ], answer: 2,
      why: { en: 'An e-TIN is a 12-digit number.', bn: 'একটি ই-টিআইএন ১২ সংখ্যার নম্বর।' } },
    { id: 'q4', q: { en: 'What is the official e-TIN portal?', bn: 'ই-টিআইএনের সরকারি পোর্টাল কোনটি?' }, options: [
      { en: 'secure.incometax.gov.bd', bn: 'secure.incometax.gov.bd' },
      { en: 'services.nidw.gov.bd', bn: 'services.nidw.gov.bd' },
      { en: 'passport.gov.bd', bn: 'passport.gov.bd' },
      { en: 'nbr.com.bd', bn: 'nbr.com.bd' } ], answer: 0,
      why: { en: 'Register at secure.incometax.gov.bd (TINHome).', bn: 'secure.incometax.gov.bd (TINHome)-এ রেজিস্টার করুন।' } },
    { id: 'q5', q: { en: 'What proves your identity when you apply?', bn: 'আবেদনের সময় আপনার পরিচয় কী দিয়ে যাচাই করা হয়?' }, options: [
      { en: 'Birth certificate only', bn: 'শুধু জন্ম নিবন্ধন সনদ' },
      { en: 'National ID (NID)', bn: 'জাতীয় পরিচয়পত্র (এনআইডি)' },
      { en: 'Driving licence only', bn: 'শুধু ড্রাইভিং লাইসেন্স' },
      { en: 'Student ID card', bn: 'শিক্ষার্থী পরিচয়পত্র' } ], answer: 1,
      why: { en: 'Your NID is checked against the Election Commission database.', bn: 'আপনার এনআইডি নির্বাচন কমিশনের তথ্যভান্ডারের সঙ্গে মিলিয়ে দেখা হয়।' } },
    { id: 'q6', q: { en: 'How do you activate your new e-TIN account?', bn: 'নতুন ই-টিআইএন অ্যাকাউন্ট কীভাবে সক্রিয় করবেন?' }, options: [
      { en: 'Pay a fee at a bank', bn: 'ব্যাংকে গিয়ে ফি জমা দিয়ে' },
      { en: 'Enter OTPs sent to your mobile and email', bn: 'মোবাইল ও ইমেইলে পাঠানো ওটিপি লিখে' },
      { en: 'Visit the tax office', bn: 'কর অফিসে গিয়ে' },
      { en: 'Send an SMS to 16555', bn: '১৬৫৫৫ নম্বরে এসএমএস পাঠিয়ে' } ], answer: 1,
      why: { en: 'NBR sends a one-time code to both your phone and your email.', bn: 'এনবিআর আপনার ফোনে ও ইমেইলে একটি করে এককালীন কোড পাঠায়।' } },
    { id: 'q7', q: { en: 'What is the minimum length of an e-TIN user ID?', bn: 'ই-টিআইএন ইউজার আইডি কমপক্ষে কত অক্ষরের হতে হয়?' }, options: [
      { en: '4 characters', bn: '৪ অক্ষর' },
      { en: '6 characters', bn: '৬ অক্ষর' },
      { en: '8 characters', bn: '৮ অক্ষর' },
      { en: '12 characters', bn: '১২ অক্ষর' } ], answer: 1,
      why: { en: 'Your user ID must be at least 6 characters long.', bn: 'আপনার ইউজার আইডি কমপক্ষে ৬ অক্ষরের হতে হয়।' } },
    { id: 'q8', q: { en: 'What is the NBR helpline number?', bn: 'এনবিআরের হেল্পলাইন নম্বর কোনটি?' }, options: [
      { en: '999', bn: '৯৯৯' },
      { en: '16263', bn: '১৬২৬৩' },
      { en: '16555', bn: '১৬৫৫৫' },
      { en: '333', bn: '৩৩৩' } ], answer: 2,
      why: { en: 'Call 16555 for help with TIN and tax matters.', bn: 'টিআইএন ও কর সংক্রান্ত সাহায্যের জন্য ১৬৫৫৫ নম্বরে কল করুন।' } },
    { id: 'q9', q: { en: 'What happens right after you submit a correct application?', bn: 'সঠিক আবেদন জমা দেওয়ার পরপরই কী হয়?' }, options: [
      { en: 'A tax officer visits your home', bn: 'একজন কর কর্মকর্তা আপনার বাড়িতে আসেন' },
      { en: 'Your NID is verified and the certificate PDF is ready to download', bn: 'আপনার এনআইডি যাচাই হয় ও সার্টিফিকেটের পিডিএফ ডাউনলোডের জন্য তৈরি হয়' },
      { en: 'You must pay ৳500', bn: 'আপনাকে ৫০০ টাকা দিতে হয়' },
      { en: 'You wait 30 working days', bn: 'আপনাকে ৩০ কর্মদিবস অপেক্ষা করতে হয়' } ], answer: 1,
      why: { en: 'With a clean NID match, the 12-digit certificate is generated in seconds.', bn: 'এনআইডি মিলে গেলে কয়েক সেকেন্ডের মধ্যে ১২ সংখ্যার সার্টিফিকেট তৈরি হয়ে যায়।' } },
    { id: 'q10', q: { en: 'Which document does a business need for its e-TIN?', bn: 'ব্যবসার ই-টিআইএনের জন্য কোন কাগজ দরকার?' }, options: [
      { en: 'Trade licence', bn: 'ট্রেড লাইসেন্স' },
      { en: 'Birth certificate', bn: 'জন্ম নিবন্ধন সনদ' },
      { en: 'SSC certificate', bn: 'এসএসসি সার্টিফিকেট' },
      { en: 'Marriage certificate', bn: 'বিবাহ সনদ' } ], answer: 0,
      why: { en: 'A proprietorship needs a valid trade licence; a company also needs its RJSC incorporation certificate.', bn: 'একক মালিকানার ব্যবসার জন্য বৈধ ট্রেড লাইসেন্স দরকার; কোম্পানির ক্ষেত্রে আরজেএসসির নিবন্ধন সনদও লাগে।' } }
  ];

  root.TinData = {
    FACTS: FACTS, WHAT: WHAT, GUIDES: GUIDES,
    CHECKLISTS: CHECKLISTS, NEED_SITUATIONS: NEED_SITUATIONS, QUIZ: QUIZ
  };
})(typeof window !== 'undefined' ? window : globalThis);

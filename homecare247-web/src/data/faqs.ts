import { FAQItem } from '@/types';

export const FAQS: FAQItem[] = [
  {
    category: 'general',
    questionKey: 'faq_q1',
    answerKey: 'faq_a1'
  },
  {
    category: 'safety',
    questionKey: 'faq_q2',
    answerKey: 'faq_a2'
  },
  {
    category: 'shifts',
    questionKey: 'faq_q3',
    answerKey: 'faq_a3'
  },
  {
    category: 'replacement',
    questionKey: 'faq_q4',
    answerKey: 'faq_a4'
  },
  {
    category: 'icu',
    questionKey: 'faq_q5',
    answerKey: 'faq_a5'
  },
  {
    category: 'insurance',
    questionKey: 'faq_q6',
    answerKey: 'faq_a6'
  },
  {
    category: 'emergency',
    questionKey: 'faq_q7',
    answerKey: 'faq_a7'
  },
  {
    category: 'equipment',
    questionKey: 'faq_q8',
    answerKey: 'faq_a8'
  }
];

export const FAQ_CONTENT: Record<
  string,
  {
    en: { q: string; a: string };
    hi: { q: string; a: string };
    bn: { q: string; a: string };
  }
> = {
  faq_q1: {
    en: {
      q: 'How quickly can you arrange a verified nurse or caregiver in my area?',
      a: 'We maintain dedicated clinical hubs across major cities. For urgent nursing procedures (injections, catheter, wound dressing) and critical care, our nurse arrives within 60 to 90 minutes. For dedicated 12-hour or 24-hour live-in attendants, deployment is confirmed within 4 to 6 hours after assessing the patient’s medical requirements.'
    },
    hi: {
      q: 'मेरे इलाके में सत्यापित नर्स या केयरगिवर कितनी जल्दी आ सकते हैं?',
      a: 'हमारे पास प्रमुख शहरों में समर्पित क्लिनिकल हब हैं। तत्काल नर्सिंग प्रक्रियाओं (इंजेक्शन, कैथेटर, घाव ड्रेसिंग) के लिए नर्स 60 से 90 मिनट में पहुंच जाती है। 12 घंटे या 24 घंटे की नियमित देखभाल के लिए मरीज की स्थिति की जांच के बाद 4 से 6 घंटे के भीतर व्यवस्था हो जाती है।'
    },
    bn: {
      q: 'আমার এলাকায় কত দ্রুত একজন প্রশিক্ষিত নার্স বা আয়া পাওয়া সম্ভব?',
      a: 'আমাদের সমস্ত শহরে নিজস্ব মেডিকেল টিম মোতায়েন থাকে। জরুরি সেবা (ইনজেকশন, ক্যাথেটার, ড্রেসিং) ৬০ থেকে ৯০ মিনিটের মধ্যে পৌঁছে দেওয়া হয়। ১২ বা ২৪ ঘণ্টার দীর্ঘমেয়াদী কেয়ারগিভার বা আয়ার ক্ষেত্রে ৪ থেকে ৬ ঘণ্টার মধ্যে রোগী অনুযায়ী সঠিক কর্মী দেওয়া হয়।'
    }
  },
  faq_q2: {
    en: {
      q: 'Are your caregivers and nursing staff police verified and medically qualified?',
      a: 'Yes, 100%. Every nurse holds a valid GNM or B.Sc Nursing qualification with state nursing council registration. All attendants and caregivers undergo a strict 4-step verification: Aadhaar biometric verification, local police background check, previous employer references, and infectious disease health screening.'
    },
    hi: {
      q: 'क्या आपके स्टाफ और नर्सों का पुलिस सत्यापन और मेडिकल योग्यता पूरी है?',
      a: 'हाँ, शत-प्रतिशत। हमारी सभी नर्सें जीएनएम या बीएससी नर्सिंग पास और नर्सिंग काउंसिल में पंजीकृत हैं। सभी सहायकों का 4-स्तरीय सत्यापन (आधार बायोमेट्रिक, पुलिस जांच, पूर्व अनुभव और स्वास्थ्य परीक्षण) अनिवार्य रूप से किया जाता है।'
    },
    bn: {
      q: 'আপনাদের কর্মী এবং নার্সরা কি পুলিশ ভেরিফায়েড এবং উপযুক্ত ডিগ্রিধারী?',
      a: 'হ্যাঁ, ১০০% নিশ্চিত। আমাদের নার্সরা স্টেট নার্সিং কাউন্সিল রেজিস্টার্ড (GNM / B.Sc Nursing)। সমস্ত আয়া ও এটেনডেন্টদের আধার বায়োমেট্রিক, স্থানীয় থানার পুলিশ ভেরিফিকেশন এবং মেডিকেল ফিটনেস সার্টিফিকেট যাচাই করে তবেই কাজে পাঠানো হয়।'
    }
  },
  faq_q3: {
    en: {
      q: 'What is the difference between a 12-hour day, 12-hour night, and 24-hour live-in shift?',
      a: '12-Hour Day Shift runs generally from 8:00 AM to 8:00 PM covering bathing, meals, medication, exercises, and daytime mobility. 12-Hour Night Shift (8:00 PM to 8:00 AM) focuses on evening medicines, diaper changing, fall prevention during nocturnal visits, and sleep monitoring. 24-Hour Live-in care provides round-the-clock presence with personal meals and sleeping breaks provided by the family, ideal for bedridden, post-surgery, or dementia patients.'
    },
    hi: {
      q: '12 घंटे दिन, 12 घंटे रात और 24 घंटे लाइव-इन शिफ्ट में क्या अंतर है?',
      a: '12 घंटे दिन की शिफ्ट (सुबह 8 से रात 8) में स्नान, भोजन, दवाइयां और टहलना शामिल है। रात की शिफ्ट (रात 8 से सुबह 8) में रात की दवाइयां, डायपर बदलना और नींद की निगरानी होती है। 24 घंटे लाइव-इन में केयरगिवर मरीज के घर ही रहकर निरंतर सेवा प्रदान करता है।'
    },
    bn: {
      q: '১২ ঘণ্টার ডে শিফট, নাইট শিফট এবং ২৪ ঘণ্টার মধ্যে পার্থক্য কী?',
      a: '১২ ঘণ্টার ডে শিফটে (সকাল ৮টা - রাত ৮টা) গোসল, ওষুধ খাওয়ানো, ব্যায়াম ও চলাফেরায় সহায়তা করা হয়। নাইট শিফটে রাতের ওষুধ, ডায়াপার পরিবর্তন ও বিশ্রামে নজর রাখা হয়। ২৪ ঘণ্টার ক্ষেত্রে কর্মী সার্বক্ষণিক রোগীর বাড়িতে থাকেন, যা শয্যাশায়ী রোগীদের জন্য অত্যন্ত কার্যকর।'
    }
  },
  faq_q4: {
    en: {
      q: 'What happens if we are not satisfied with the assigned caregiver or nurse?',
      a: 'We provide an unconditional, free caregiver replacement guarantee. If you feel the chemistry or bedside manner is not matching your expectation, simply notify your dedicated Care Coordinator on WhatsApp or phone, and a qualified replacement will be provided within 12 hours at no extra charge.'
    },
    hi: {
      q: 'यदि हम दिए गए केयरगिवर या नर्स के काम से संतुष्ट नहीं हुए तो क्या होगा?',
      a: 'हम निःशुल्क रिप्लेसमेंट गारंटी देते हैं। यदि आपको किसी भी कारण से कार्यकर्ता का काम पसंद नहीं आता, तो आप अपने केयर मैनेजर को सूचित करें, 12 घंटे के भीतर बिना किसी अतिरिक्त शुल्क के दूसरा योग्य कर्मी भेज दिया जाएगा।'
    },
    bn: {
      q: 'নিযুক্ত নার্স বা আয়ার কাজে অসন্তুষ্ট হলে কী ব্যবস্থা রয়েছে?',
      a: 'আমাদের রয়েছে ফ্রি রিপ্লেসমেন্ট গ্যারান্টি। কোনো কারণে কর্মীর সেবা পছন্দ না হলে আপনার কেয়ার ম্যানেজারকে জানালেই ১২ ঘণ্টার মধ্যে কোনো অতিরিক্ত চার্জ ছাড়াই অন্য কর্মী দেওয়া হবে।'
    }
  },
  faq_q5: {
    en: {
      q: 'How does an ICU Setup at Home work, and how much can it save compared to hospital ICU?',
      a: 'Our biomedical engineers bring hospital-certified invasive/non-invasive ventilators, multi-parameter monitors, oxygen concentrators, BiPAP, suction units, and electric hospital beds to your home. Dedicated critical care nurses (CCRN) manage the patient under the remote supervision of a Senior Intensivist (MD Doctor). It typically saves families 60% to 70% compared to private hospital ICU tariffs while reducing hospital-acquired infection risks.'
    },
    hi: {
      q: 'घर पर आईसीयू सेटअप कैसे काम करता है और अस्पताल की तुलना में कितनी बचत होती है?',
      a: 'हमारे बायोमेडिकल इंजीनियर वेंटिलेटर, मल्टी-पैरा मॉनिटर, ऑक्सीजन, बाईपैप और रिमोट डॉक्टर निगरानी के साथ आपके घर को मिनी-आईसीयू बना देते हैं। अनुभवी आईसीयू नर्स 24 घंटे मौजूद रहती हैं। इससे अस्पताल के आईसीयू की तुलना में 60% से 70% तक की भारी बचत होती है और संक्रमण का खतरा भी कम होता है।'
    },
    bn: {
      q: 'বাড়িতে আইসিইউ সেটআপ কীভাবে কাজ করে এবং এতে কত খরচ সাশ্রয় হয়?',
      a: 'আমাদের ইঞ্জিনিয়াররা রোগীর ঘরে হাসপাতালের মতো ভেন্টিলেটর, মাল্টিপ্যারা মনিটর, অক্সিজেন কনসেনট্রেটর এবং ইলেকট্রিক বেড সেটআপ করেন। অভিজ্ঞ ক্রিটিক্যাল কেয়ার নার্স সার্বক্ষণিক থাকেন এবং সিনিয়র ডাক্তার প্রতিদিন মনিটরিং করেন। হাসপাতালের আইসিইউ খরচের তুলনায় প্রায় ৬০-৭০% টাকা সাশ্রয় হয়।'
    }
  },
  faq_q6: {
    en: {
      q: 'Can we claim health insurance for home nursing and home hospitalization?',
      a: 'Yes! Many leading health insurance policies (under Domiciliary Hospitalization clauses) cover home healthcare when prescribed by an authorized medical practitioner. We provide detailed GST invoices, daily nursing vital logs, doctor prescription records, and clinical discharge summaries required by TPA and insurance claim desks.'
    },
    hi: {
      q: 'क्या हम होम नर्सिंग और होम केयर के लिए स्वास्थ्य बीमा क्लेम कर सकते हैं?',
      a: 'हाँ! डॉक्टर की लिखित सलाह होने पर अधिकांश प्रमुख स्वास्थ्य बीमा कंपनियां (डोमिसिलियरी हॉस्पिटलाइजेशन के तहत) होम केयर कवर करती हैं। हम बीमा दावे के लिए जरूरी जीएसटी बिल, दैनिक वाइटल्स चार्ट और डॉक्टर रिपोर्ट प्रदान करते हैं।'
    },
    bn: {
      q: 'হোম নার্সিং কি স্বাস্থ্য বীমার (Health Insurance) আওতায় আসে?',
      a: 'হ্যাঁ, চিকিৎসকের পরামর্শ অনুযায়ী অধিকাংশ স্বনামধন্য স্বাস্থ্য বীমা কোম্পানি ডমিসিলিয়ারি হসপিটালাইজেশন বা হোম কেয়ার কভার করে। আমরা ইনস্যুরেন্স ও TPA ক্লিয়ারেন্সের জন্য প্রয়োজনীয় জিএসটি বিল, নার্সিং চার্ট ও প্রেসক্রিপশন প্রদান করি।'
    }
  },
  faq_q7: {
    en: {
      q: 'What is the procedure during sudden medical emergencies at home?',
      a: 'All our registered nurses are trained in BLS (Basic Life Support) and ACLS protocols. In case of acute decompensation, the on-duty nurse initiates oxygen therapy and primary stabilization, while our 24/7 central control desk instantly dispatches a local cardiac ambulance to safely transfer the patient to the nearest partner hospital emergency ward.'
    },
    hi: {
      q: 'घर पर अचानक मेडिकल इमरजेंसी होने पर क्या प्रोटोकॉल है?',
      a: 'हमारी सभी नर्सें बेसिक लाइफ सपोर्ट (बीएलएस) में प्रशिक्षित हैं। किसी भी आपात स्थिति में ऑन-ड्यूटी नर्स तुरंत प्राथमिक उपचार और ऑक्सीजन शुरू करती है, जबकि हमारा 24/7 कंट्रोल रूम तुरंत नजदीकी अस्पताल के लिए एम्बुलेंस रवाना करता है।'
    },
    bn: {
      q: 'হঠাৎ কোনো শারীরিক জরুরি পরিস্থিতি দেখা দিলে আপনারা কীভাবে সাহায্য করেন?',
      a: 'আমাদের নার্সরা লাইফ সাপোর্ট (BLS/ACLS) প্রশিক্ষিত। জরুরি পরিস্থিতিতে অন-ডিউটি নার্স দ্রুত প্রাথমিক চিকিৎসা ও অক্সিজেন সাপোর্ট শুরু করেন এবং আমাদের কন্ট্রোল রুম থেকে নিকটস্থ হাসপাতালে স্থানান্তরের জন্য তাৎক্ষণিক কার্ডিয়াক অ্যাম্বুলেন্স পাঠানো হয়।'
    }
  },
  faq_q8: {
    en: {
      q: 'How does medical equipment rental and delivery work?',
      a: 'We maintain our own sanitized medical equipment warehouse in each city. Once booked, our biomedical technician delivers, sanitizes, installs, and provides complete hands-on operation training to the family members within 2 to 4 hours. No security deposit hassles and transparent monthly rental plans.'
    },
    hi: {
      q: 'मेडिकल उपकरण किराए पर लेने और डिलीवरी की क्या प्रक्रिया है?',
      a: 'हर शहर में हमारा अपना मेडिकल उपकरण गोदाम है। बुकिंग के 2 से 4 घंटे के भीतर हमारे तकनीशियन उपकरण पहुंचाकर, सैनिटाइज करके इंस्टॉल कर देते हैं और परिवार को चलाने की पूरी ट्रेनिंग देते हैं। आसान मासिक किराया उपलब्ध है।'
    },
    bn: {
      q: 'মেডিকেল সরঞ্জাম ভাড়া নেওয়ার পদ্ধতি কী এবং ডেলিভারি কত দ্রুত হয়?',
      a: 'আমাদের নিজস্ব ইকুইপমেন্ট হাব থেকে ২ থেকে ৪ ঘণ্টার মধ্যে অক্সিজেন কনসেনট্রেটর, বেড বা হুইলচেয়ার সম্পূর্ণ জীবাণুমুক্ত করে বাড়িতে পৌঁছে দেওয়া হয়। টেকনিশিয়ান এসে সম্পূর্ণ ফিটিং করে ব্যবহার বুঝিয়ে দেন।'
    }
  }
};


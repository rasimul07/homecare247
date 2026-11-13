import { Testimonial } from '@/types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Anirban Mukherjee',
    relationship: 'Son of Stroke Patient (Age 74)',
    service: 'Critical ICU & Nursing Care',
    cityId: 'kolkata',
    cityName: 'Kolkata (Salt Lake)',
    rating: 5,
    comment:
      'When my father was discharged from AMRI Salt Lake with a tracheostomy and catheter, we were terrified about handling him at home. HomeCare 24/7 dispatched Nurse Debashis within 2 hours. His gentle handling, sterile suctioning, and daily vital checks gave my father a second life. Unmatched reliability!',
    commentHi:
      'जब मेरे पिता को साल्ट लेक के अस्पताल से ट्रेकियोस्टॉमी के साथ डिस्चार्ज किया गया, तो हम बहुत चिंतित थे। HomeCare 24/7 ने 2 घंटे के भीतर नर्स देबाशीष को भेजा। उनके पेशेवर काम और प्यार भरे व्यवहार ने मेरे पिता को नई जिंदगी दी।',
    commentBn:
      'সল্টলেকের হাসপাতাল থেকে যখন বাবাকে ট্র্যাকিওস্টমি নিয়ে বাড়ি নিয়ে আসি, তখন আমরা খুবই চিন্তিত ছিলাম। HomeCare 24/7 মাত্র ২ ঘণ্টার মধ্যে দক্ষ নার্স পাঠায়। নার্সের যত্ন ও নিয়মিত চেক-আপে বাবা এখন অনেকটা সুস্থ। অসংখ্য ধন্যবাদ!',
    date: '2 weeks ago',
    verifiedPatient: true
  },
  {
    id: 't-2',
    name: 'Dr. Shalini Sengupta',
    relationship: 'Daughter of Alzheimer’s Patient (Age 81)',
    service: '24/7 Bedside Attendant & Dementia Care',
    cityId: 'kolkata',
    cityName: 'Kolkata (Ballygunge)',
    rating: 5,
    comment:
      'Living abroad in London while my mother lives alone in South Kolkata was painful. HomeCare 24/7 provided two verified female caregivers on 12-hour rotation. The supervisor doctor visits every week and shares vitals directly on WhatsApp. I can finally sleep peacefully knowing she is safe.',
    commentHi:
      'लंदन में रहते हुए कोलकाता में मेरी वृद्ध माँ की देखभाल एक बड़ी चिंता थी। HomeCare 24/7 ने दो सत्यापित सहायिकाओं की व्यवस्था की। डॉक्टर हर हफ्ते आकर रिपोर्ट व्हाट्सएप पर भेजते हैं। उत्कृष्ट सेवा!',
    commentBn:
      'লন্ডনে বসে কলকাতায় একলা মায়ের দেখাশোনা নিয়ে চরম দুশ্চিন্তায় ছিলাম। HomeCare 24/7 দুইজন পুলিশ ভেরিফায়েড আয়া পাঠিয়েছে। সাপ্তাহিক ডাক্তার ভিজিটের রিপোর্ট হোয়াটসঅ্যাপে পেয়ে আমি নিশ্চিন্ত।',
    date: '1 month ago',
    verifiedPatient: true
  },
  {
    id: 't-3',
    name: 'Vikram & Pooja Malhotra',
    relationship: 'Family of Post-Cardiac Surgery Patient',
    service: 'ICU Setup & Cardiac Monitoring',
    cityId: 'delhi-ncr',
    cityName: 'Delhi NCR (Gurugram)',
    rating: 5,
    comment:
      'After coronary bypass surgery, hospital ICU charges were exceeding ₹35,000 daily. HomeCare 24/7 set up a full motorized hospital bed, multipara monitor, and BiPAP machine in our bedroom at less than one-third the cost. The critical care nurse was top tier.',
    commentHi:
      'हार्ट सर्जरी के बाद अस्पताल का आईसीयू खर्च बहुत ज्यादा था। HomeCare 24/7 ने हमारे बेडरूम में ही पूरा आईसीयू सेटअप और कुशल आईसीयू नर्स उपलब्ध कराई। एक तिहाई खर्च में अस्पताल जैसी सुविधा मिली।',
    commentBn:
      'হার্ট সার্জারির পর হাসপাতালের আইসিইউ খরচের তুলনায় মাত্র এক-তৃতীয়াংশ খরচে HomeCare 24/7 আমাদের ঘরেই সম্পূর্ণ আইসিইউ সেটআপ ও দক্ষ ক্রিটিক্যাল কেয়ার নার্স দিয়েছে। অসাধারণ অভিজ্ঞতা।',
    date: '3 weeks ago',
    verifiedPatient: true
  },
  {
    id: 't-4',
    name: 'Rajesh Kulkarni',
    relationship: 'Son of Post-TKR Patient (Age 68)',
    service: 'Home Physiotherapy & Rehab',
    cityId: 'mumbai',
    cityName: 'Mumbai (Andheri)',
    rating: 5,
    comment:
      'Dr. Pradeep, the senior physiotherapist from HomeCare 24/7, was exceptional. My mother walked without a walker in just 18 days after bilateral knee replacement. Punctual, polite, and clinically top-notch.',
    commentHi:
      'घुटने के प्रत्यारोपण के बाद डॉ. प्रदीप ने इतनी अच्छी फिजियोथेरेपी करवाई कि मेरी माँ मात्र 18 दिनों में बिना वॉकर के चलने लगीं। समय के पाबंद और बहुत अनुभवी।',
    commentBn:
      'হাঁটু প্রতিস্থাপনের পর ফিজিওথেরাপিস্টের নিয়মিত সেশনে মা মাত্র ১৮ দিনে ওয়াকার ছাড়া হাঁটতে পেরেছেন। অত্যন্ত পেশাদার ও সহানুভূতিশীল দল।',
    date: '1 month ago',
    verifiedPatient: true
  },
  {
    id: 't-5',
    name: 'Swati Sundaram',
    relationship: 'Daughter of Parkinson’s Patient (Age 77)',
    service: 'Elderly Caregiver 24-Hour Live-in',
    cityId: 'bengaluru',
    cityName: 'Bengaluru (Koramangala)',
    rating: 5,
    comment:
      'The caregiver matched for my father is like a family member now. He manages meals, medication timings, assisted walking, and handles mood swings with extreme patience. Background check and police verification papers were handed over on day 1.',
    commentHi:
      'मेरे पिता के लिए जो केयरगिवर भेजा गया, वह अब परिवार के सदस्य जैसा है। भोजन, दवाइयां और टहलने में बहुत मदद करता है। पहले ही दिन पुलिस सत्यापन दस्तावेज सौंपे गए थे।',
    commentBn:
      'আমার বাবার জন্য যে সেবিকা দেওয়া হয়েছে তিনি পরিবারের সদস্যের মতো। ওষুধ, পথ্য ও চলাফেরায় অসম্ভব ধৈর্য নিয়ে যত্ন নেন। প্রথম দিনেই পুলিশ ভেরিফিকেশন জমা দিয়েছিল।',
    date: '2 months ago',
    verifiedPatient: true
  }
];


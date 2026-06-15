const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const Doctor = require('./models/Doctor');

const doctors = [
  { name: 'James Carter',  email: 'james@demo.com',  speciality: 'Cardiologist',   degree: 'MBBS, MD', experience: '8 years',  fees: 120, rating: 4.9, available: true,  about: 'Experienced cardiologist specializing in heart diseases.' },
  { name: 'Sarah Lin',     email: 'sarah@demo.com',  speciality: 'Dermatologist',  degree: 'MBBS, MD', experience: '6 years',  fees: 90,  rating: 4.8, available: true,  about: 'Expert in skin care and dermatological conditions.' },
  { name: 'Raj Patel',     email: 'raj@demo.com',    speciality: 'Neurologist',    degree: 'MBBS, MD', experience: '12 years', fees: 150, rating: 4.9, available: true,  about: 'Senior neurologist with expertise in brain disorders.' },
  { name: 'Emily Chen',    email: 'emily@demo.com',  speciality: 'Pediatrician',   degree: 'MBBS, MD', experience: '5 years',  fees: 80,  rating: 4.7, available: true,  about: 'Caring pediatrician dedicated to child healthcare.' },
  { name: 'Mike Torres',   email: 'mike@demo.com',   speciality: 'Orthopedist',    degree: 'MBBS, MD', experience: '10 years', fees: 110, rating: 4.8, available: true,  about: 'Specialist in bone and joint conditions.' },
  { name: 'Priya Shah',    email: 'priya@demo.com',  speciality: 'Gynecologist',   degree: 'MBBS, MD', experience: '7 years',  fees: 95,  rating: 4.9, available: true,  about: "Expert in women's health and gynecological care." },
  { name: 'David Kim',     email: 'david@demo.com',  speciality: 'Psychiatrist',   degree: 'MBBS, MD', experience: '9 years',  fees: 130, rating: 4.7, available: true,  about: 'Compassionate psychiatrist specializing in mental health.' },
  { name: 'Lisa Wang',     email: 'lisa@demo.com',   speciality: 'Ophthalmologist',degree: 'MBBS, MD', experience: '6 years',  fees: 100, rating: 4.8, available: false, about: 'Eye care specialist with advanced surgical skills.' },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    await Doctor.deleteMany({});
    console.log('🗑️  Old doctors cleared');
    const password = await bcrypt.hash('password123', 10);
    const seeded = doctors.map(d => ({ ...d, password }));
    await Doctor.insertMany(seeded);
    console.log(`✅ ${doctors.length} doctors seeded successfully!`);
    console.log('\n📋 Doctor Login Credentials:');
    doctors.forEach(d => console.log(`   ${d.name}: ${d.email} / password123`));
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDoctors();
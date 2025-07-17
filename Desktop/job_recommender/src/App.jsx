import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import UserProfileCard from './components/UserProfileModal';
import { simulatedJobMarketData, simulatedCourseCatalog } from './data/simulatedData';
import { fetchAdzunaJobs } from './utils/adzuna';
import './AppLayout.css';

// Global variables provided by the Canvas environment
const __app_id = window.__app_id || "default-app-id";
const __initial_auth_token = window.__initial_auth_token || "";

// --- Simulated Data (In a real app, this would come from APIs/database) ---
// const simulatedJobMarketData = [
//   {
//     id: 'job1',
//     title: 'Frontend Developer',
//     requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'UI/UX Basics'],
//     averageSalary: 80000,
//     environment: 'startup',
//     description: 'Build interactive user interfaces for web applications.',
//   },
//   {
//     id: 'job2',
//     title: 'Backend Engineer',
//     requiredSkills: ['Python', 'Node.js', 'Databases', 'APIs', 'Cloud Computing'],
//     averageSalary: 95000,
//     environment: 'corporate',
//     description: 'Design and implement server-side logic and databases.',
//   },
//   {
//     id: 'job3',
//     title: 'Data Scientist',
//     requiredSkills: ['Python', 'R', 'Machine Learning', 'Statistics', 'Data Visualization'],
//     averageSalary: 110000,
//     environment: 'remote',
//     description: 'Analyze complex data to extract insights and build predictive models.',
//   },
//   {
//     id: 'job4',
//     title: 'UI/UX Designer',
//     requiredSkills: ['Figma', 'Sketch', 'User Research', 'Wireframing', 'Prototyping'],
//     averageSalary: 75000,
//     environment: 'startup',
//     description: 'Create intuitive and aesthetically pleasing user experiences.',
//   },
//   {
//     id: 'job5',
//     title: 'Project Manager',
//     requiredSkills: ['Agile', 'Scrum', 'Communication', 'Leadership', 'Risk Management'],
//     averageSalary: 90000,
//     environment: 'corporate',
//     description: 'Oversee projects from conception to delivery, ensuring goals are met.',
//   },
//   {
//     id: 'job6',
//     title: 'Mobile App Developer',
//     requiredSkills: ['React Native', 'Swift', 'Kotlin', 'APIs', 'Mobile UI/UX'],
//     averageSalary: 88000,
//     environment: 'startup',
//     description: 'Develop and maintain applications for iOS and Android platforms.',
//   },
//   {
//     id: 'job7',
//     title: 'Cloud Architect',
//     requiredSkills: ['AWS', 'Azure', 'GCP', 'System Design', 'Networking', 'Security'],
//     averageSalary: 120000,
//     environment: 'corporate',
//     description: 'Design and implement scalable cloud infrastructure solutions.',
//   },
//   {
//     id: 'job8',
//     title: 'Digital Marketing Specialist',
//     requiredSkills: ['SEO', 'SEM', 'Content Marketing', 'Social Media', 'Analytics'],
//     averageSalary: 65000,
//     environment: 'remote',
//     description: 'Develop and execute digital marketing strategies to drive growth.',
//   },
//   {
//     id: 'job9',
//     title: 'Cybersecurity Analyst',
//     requiredSkills: ['Network Security', 'Incident Response', 'Vulnerability Assessment', 'Compliance'],
//     averageSalary: 100000,
//     environment: 'corporate',
//     description: 'Protect systems and data from cyber threats.',
//   },
//   {
//     id: 'job10',
//     title: 'Technical Writer',
//     requiredSkills: ['Documentation', 'Clarity', 'Grammar', 'Software Development Life Cycle', 'Research'],
//     averageSalary: 70000,
//     environment: 'remote',
//     description: 'Create clear and concise technical documentation for software products.',
//   },
// ];

// const simulatedCourseCatalog = [
//   {
//     id: 'course1',
//     name: 'React Fundamentals',
//     skillsTaught: ['React', 'JavaScript', 'UI/UX Basics'],
//     difficulty: 'Beginner',
//     provider: 'Coursera',
//     url: 'https://example.com/react-course',
//   },
//   {
//     id: 'course2',
//     name: 'Advanced Python for Data Science',
//     skillsTaught: ['Python', 'Machine Learning', 'Data Visualization'],
//     difficulty: 'Advanced',
//     provider: 'edX',
//     url: 'https://example.com/python-data-science',
//   },
//   {
//     id: 'course3',
//     name: 'Node.js and Express.js Bootcamp',
//     skillsTaught: ['Node.js', 'APIs', 'Databases'],
//     difficulty: 'Intermediate',
//     provider: 'Udemy',
//     url: 'https://example.com/nodejs-course',
//   },
//   {
//     id: 'course4',
//     name: 'Introduction to Cloud Computing (AWS)',
//     skillsTaught: ['Cloud Computing', 'AWS'],
//     difficulty: 'Beginner',
//     provider: 'Pluralsight',
//     url: 'https://example.com/aws-intro',
//   },
//   {
//     id: 'course5',
//     name: 'User Experience (UX) Design Principles',
//     skillsTaught: ['UI/UX Basics', 'User Research', 'Wireframing'],
//     difficulty: 'Beginner',
//     provider: 'Google UX Design Certificate',
//     url: 'https://example.com/ux-design',
//   },
//   {
//     id: 'course6',
//     name: 'Agile Project Management',
//     skillsTaught: ['Agile', 'Scrum', 'Leadership'],
//     difficulty: 'Intermediate',
//     provider: 'Project Management Institute',
//     url: 'https://example.com/agile-pm',
//   },
//   {
//     id: 'course7',
//     name: 'Mobile App Development with React Native',
//     skillsTaught: ['React Native', 'Mobile UI/UX'],
//     difficulty: 'Intermediate',
//     provider: 'Udemy',
//     url: 'https://example.com/react-native',
//   },
//   {
//     id: 'course8',
//     name: 'Cybersecurity Fundamentals',
//     skillsTaught: ['Network Security', 'Vulnerability Assessment'],
//     difficulty: 'Beginner',
//     provider: 'Cybrary',
//     url: 'https://example.com/cybersecurity-fundamentals',
//   },
// ];
// --- End Simulated Data ---

function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // No modal, so no need for showUserProfileModal
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  // Add a state to track login
  const [loggedInUser, setLoggedInUser] = useState(null);
  // Add a state to track which form to show
  const [showSignUp, setShowSignUp] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);

  // State for profile form
  const [formSkills, setFormSkills] = useState('');
  const [formInterests, setFormInterests] = useState('');
  const [formEducation, setFormEducation] = useState('');
  const [formWorkExperience, setFormWorkExperience] = useState('');
  const [formCareerAspirations, setFormCareerAspirations] = useState('');
  const [formSalaryExpectations, setFormSalaryExpectations] = useState(0);
  const [formPreferredWorkEnvironments, setFormPreferredWorkEnvironments] = useState([]);

  // Pre-populate dropdown options
  const skillOptions = Array.from(new Set(simulatedJobMarketData.flatMap(j => j.requiredSkills)));
  const interestOptions = ['AI', 'Web Development', 'Finance', 'Cloud', 'Security', 'Design', 'Marketing', 'Management'];
  const educationOptions = [
    "Bachelor's in Computer Science",
    "Master's in Data Science",
    "Associate's in IT",
    "PhD in Engineering",
    "Bootcamp Graduate",
    "Self-taught"
  ];
  const aspirationOptions = Array.from(new Set(simulatedJobMarketData.map(j => j.title)));
  const environmentOptions = ['remote', 'startup', 'corporate', 'hybrid'];

  // Setup Firebase
  useEffect(() => {
    const setupFirebase = async () => {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        // Use Vite environment variables for Firebase config
        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID
        };

        if (Object.keys(firebaseConfig).length === 0) {
          throw new Error("Firebase configuration is missing.");
        }

        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const authentication = getAuth(app);

        // Always sign out on app load
        await signOut(authentication);

        setDb(firestore);
        setAuth(authentication);

        onAuthStateChanged(authentication, async (user) => {
          if (user) {
            setUserId(user.uid);
            setLoggedInUser(user); // Update loggedInUser state
            setEmailVerified(user.emailVerified);
            if (!user.emailVerified) {
              setShowVerifyNotice(true);
              setLoading(false);
              return;
            }
            const userProfileRef = doc(firestore, `artifacts/${appId}/users/${user.uid}/profile/data`);
            const userProfileSnap = await getDoc(userProfileRef);

            if (userProfileSnap.exists()) {
              const profileData = userProfileSnap.data();
              setUserProfile(profileData);
              // Populate form with existing data
              setFormSkills(profileData.skills || '');
              setFormInterests(profileData.interests || '');
              setFormEducation(profileData.education || '');
              setFormWorkExperience(profileData.workExperience || '');
              setFormCareerAspirations(profileData.careerAspirations || '');
              setFormSalaryExpectations(profileData.salaryExpectations || 0);
              setFormPreferredWorkEnvironments(profileData.preferredWorkEnvironments || []);
            }
            setLoading(false);
          } else {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              await signInWithCustomToken(authentication, __initial_auth_token);
            }
            setLoading(false);
          }
        });

      } catch (e) {
        console.error("Error setting up Firebase:", e);
        setError(`Failed to initialize application: ${e.message}`);
        setLoading(false);
      }
    };

    setupFirebase();
  }, []);

  // Recommendation Logic
  useEffect(() => {
    async function getRecommendations() {
      if (userProfile) {
        const userSkills = userProfile.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
        const userAspirations = userProfile.careerAspirations.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
        const searchTerms = [...userSkills, ...userAspirations].join(' ');

        // --- Simulated Job Recommendations ---
        const jobs = simulatedJobMarketData.map(job => {
          const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
          let skillMatchScore = 0;
          let aspirationMatchScore = 0;
          let environmentMatch = userProfile.preferredWorkEnvironments.includes(job.environment);
          let salaryMatch = job.averageSalary >= userProfile.salaryExpectations;

          // Calculate skill overlap
          userSkills.forEach(userSkill => {
            if (jobSkills.includes(userSkill)) {
              skillMatchScore++;
            }
          });

          // Calculate aspiration overlap
          userAspirations.forEach(aspiration => {
            if (job.title.toLowerCase().includes(aspiration) || job.description.toLowerCase().includes(aspiration)) {
              aspirationMatchScore++;
            }
          });

          // Simple scoring: prioritize skill match, then aspiration, then environment/salary
          const score = (skillMatchScore * 10) + (aspirationMatchScore * 5) + (environmentMatch ? 2 : 0) + (salaryMatch ? 1 : 0);

          return { ...job, score, skillMatchScore, aspirationMatchScore, environmentMatch, salaryMatch, source: 'simulated' };
        });

        // --- Adzuna Job Recommendations ---
        let adzunaJobs = [];
        if (searchTerms) {
          adzunaJobs = await fetchAdzunaJobs({ what: searchTerms, country: 'us', results_per_page: 5 });
        }
        const adzunaFormatted = adzunaJobs.map(job => ({
          id: job.id,
          title: job.title,
          requiredSkills: [],
          averageSalary: job.salary_average || 0,
          environment: job.contract_time || 'unknown',
          description: job.description,
          score: 0, // Could add scoring logic if desired
          source: 'adzuna',
          url: job.redirect_url
        }));

        // --- Merge and sort jobs ---
        const allJobs = [...jobs, ...adzunaFormatted];
        const topJobs = allJobs.sort((a, b) => b.score - a.score).slice(0, 8);
        setRecommendedJobs(topJobs);

        // --- Learning Path Recommendations (unchanged) ---
        const neededSkills = new Set();
        topJobs.forEach(job => {
          if (job.requiredSkills) {
            job.requiredSkills.forEach(skill => {
              if (!userSkills.includes(skill.toLowerCase())) {
                neededSkills.add(skill);
              }
            });
          }
        });

        const courses = simulatedCourseCatalog.map(course => {
          const courseSkills = course.skillsTaught.map(s => s.toLowerCase());
          let skillGapCoverage = 0;
          neededSkills.forEach(neededSkill => {
            if (courseSkills.includes(neededSkill.toLowerCase())) {
              skillGapCoverage++;
            }
          });
          return { ...course, skillGapCoverage };
        });

        // Sort by skill gap coverage (descending)
        const topCourses = courses.sort((a, b) => b.skillGapCoverage - a.skillGapCoverage).filter(c => c.skillGapCoverage > 0).slice(0, 5);
        setRecommendedCourses(topCourses);
      }
    }
    getRecommendations();
  }, [userProfile]); // Re-run recommendations when user profile changes

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!db || !userId) return;

    setLoading(true);
    try {
      const newProfileData = {
        skills: formSkills,
        interests: formInterests,
        education: formEducation,
        workExperience: formWorkExperience,
        careerAspirations: formCareerAspirations,
        salaryExpectations: formSalaryExpectations,
        preferredWorkEnvironments: formPreferredWorkEnvironments,
      };

      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userProfileRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      await setDoc(userProfileRef, newProfileData, { merge: true });

      setUserProfile(newProfileData); // Update local state
      setEditingProfile(false); // Hide profile card after save
      setLoading(false);
    } catch (e) {
      console.error("Error updating profile:", e);
      setError(`Failed to update profile: ${e.message}`);
      setLoading(false);
    }
  };

  const handleEnvironmentChange = (e) => {
    const { value, checked } = e.target;
    setFormPreferredWorkEnvironments((prev) =>
      checked ? [...prev, value] : prev.filter((env) => env !== value)
    );
  };

  // If not logged in, show login or sign-up form
  if (!userId && !loading) {
    return (
      <div className="app-main-container">
        <header className="app-header">Career Path Navigator</header>
        <section className="app-section">
          {showSignUp ? (
            <SignUpForm
              onSignUp={() => setShowSignUp(false)}
              onSwitchToLogin={() => setShowSignUp(false)}
            />
          ) : (
            <LoginForm
              onSwitchToSignUp={() => setShowSignUp(true)}
            />
          )}
        </section>
      </div>
    );
  }

  if (showVerifyNotice && loggedInUser && !emailVerified) {
    return (
      <div className="app-main-container">
        <header className="app-header">Career Path Navigator</header>
        <section className="app-section">
          <div style={{ color: '#eab308', fontWeight: 500, fontSize: '1.1rem', textAlign: 'center' }}>
            Your email is not verified.<br />
            Please check your inbox and click the verification link.<br />
            <button
              className="signup-form-btn"
              style={{ marginTop: '1.5rem', background: '#e5e7eb', color: '#333' }}
              onClick={async () => {
                if (loggedInUser) {
                  await sendEmailVerification(loggedInUser);
                  alert('Verification email resent!');
                }
              }}
            >
              Resend Verification Email
            </button>
            <button
              className="signup-form-btn"
              style={{ marginTop: '1.5rem', marginLeft: '1rem', background: '#ef4444', color: '#fff' }}
              onClick={async () => {
                const auth = getAuth();
                await signOut(auth);
                window.location.reload();
              }}
            >
              Log Out
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-main-container">
        <header className="app-header">Career Path Navigator</header>
        <section className="app-section">
          <div>Loading application...</div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-main-container">
        <header className="app-header">Career Path Navigator</header>
        <section className="app-section">
          <div>Error: {error}</div>
        </section>
      </div>
    );
  }

  // Only allow access to the app if emailVerified is true
  if (!emailVerified) return null;

  return (
    <div className="app-main-container">
      <header className="app-header">Career Path Navigator</header>
      <section className="app-section">
        {(editingProfile || !userProfile) && (
          <UserProfileCard
            formSkills={formSkills}
            setFormSkills={setFormSkills}
            formInterests={formInterests}
            setFormInterests={setFormInterests}
            formEducation={formEducation}
            setFormEducation={setFormEducation}
            formWorkExperience={formWorkExperience}
            setFormWorkExperience={setFormWorkExperience}
            formCareerAspirations={formCareerAspirations}
            setFormCareerAspirations={setFormCareerAspirations}
            formSalaryExpectations={formSalaryExpectations}
            setFormSalaryExpectations={setFormSalaryExpectations}
            formPreferredWorkEnvironments={formPreferredWorkEnvironments}
            setFormPreferredWorkEnvironments={setFormPreferredWorkEnvironments}
            handleProfileUpdate={handleProfileUpdate}
            handleEnvironmentChange={handleEnvironmentChange}
            skillOptions={skillOptions}
            interestOptions={interestOptions}
            educationOptions={educationOptions}
            aspirationOptions={aspirationOptions}
            environmentOptions={environmentOptions}
          />
        )}
        {userId && userProfile && !editingProfile && (
          <div>
            <p>Your Profile Summary:</p>
            <p><span>Skills:</span> {userProfile.skills || 'N/A'}</p>
            <p><span>Aspirations:</span> {userProfile.careerAspirations || 'N/A'}</p>
            <p><span>Preferred Environments:</span> {userProfile.preferredWorkEnvironments.join(', ') || 'N/A'}</p>
            <p>User ID: <span>{userId}</span></p>
            <button onClick={() => setEditingProfile(true)} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 500, cursor: 'pointer' }}>Edit Profile</button>
          </div>
        )}
        <div>
          {/* Recommended Job Roles */}
          <section>
            <h2>Recommended Job Roles</h2>
            {recommendedJobs.length > 0 ? (
              <div>
                {recommendedJobs.map((job) => (
                  <div key={job.id}>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                    <p>
                      **Skills Needed:** {job.requiredSkills.join(', ')} <br />
                      **Est. Salary:** ${job.averageSalary.toLocaleString()} | **Environment:** {job.environment}
                    </p>
                    <p>
                      (Skill Match: {job.skillMatchScore}, Aspiration Match: {job.aspirationMatchScore})
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Please complete your profile to see job recommendations.</p>
            )}
          </section>

          {/* Recommended Learning Paths */}
          <section>
            <h2>Recommended Learning Paths</h2>
            {recommendedCourses.length > 0 ? (
              <div>
                {recommendedCourses.map((course) => (
                  <div key={course.id}>
                    <h3>{course.name}</h3>
                    <p>
                      **Skills Covered:** {course.skillsTaught.join(', ')}
                    </p>
                    <p>
                      **Difficulty:** {course.difficulty} | **Provider:** {course.provider}
                    </p>
                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>Complete your profile to find courses to fill skill gaps.</p>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

export default App;
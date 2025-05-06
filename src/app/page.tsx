/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { format, subDays, addDays, isToday } from "date-fns";

// Enhanced realistic data
const generateRealisticData = () => {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i);
    days.push(format(day, "EEE"));
  }

  // More realistic sleep pattern with natural variations
  const sleepData = days.map((day, index) => {
    let baseHours;
    if (day === "Fri" || day === "Sat") {
      baseHours = 8 + Math.random() * 1.5; // Weekend more sleep
    } else {
      baseHours = 6.5 + Math.random() * 1.5; // Weekday less sleep
    }
    return { 
      day, 
      hours: parseFloat(baseHours.toFixed(1)),
      date: format(subDays(today, 6 - index), "MMM d")
    };
  });

  // Natural water intake pattern
  const waterData = days.map((day) => {
    const isWeekend = day === "Sat" || day === "Sun";
    const base = isWeekend ? 5 : 7;
    return { 
      day, 
      cups: Math.floor(base + Math.random() * 3 - 1) 
    };
  });

  // Screen time with weekend spike
  const screenTimeData = days.map((day) => {
    const isWeekend = day === "Sat" || day === "Sun";
    const base = isWeekend ? 5 : 3;
    return { 
      day, 
      hours: parseFloat((base + Math.random() * 2).toFixed(1)) 
    };
  });

  return { sleepData, waterData, screenTimeData, days };
};

const { sleepData, waterData, screenTimeData, days } = generateRealisticData();

// Extended mood data for mood tracking
const moodHistory = [
  { date: "May 1", mood: "😊", score: 4, notes: "Great productive day!" },
  { date: "May 2", mood: "😐", score: 3, notes: "Average day, nothing special" },
  { date: "May 3", mood: "🙁", score: 2, notes: "Stressful meeting at work" },
  { date: "May 4", mood: "😊", score: 4, notes: "Went for a long walk" },
  { date: "May 5", mood: "😄", score: 5, notes: "Finished a major project!" },
  { date: "May 6", mood: "😊", score: 4, notes: "Had dinner with friends" },
];

// Enhanced habit data with more details
const initialHabits = [
  { 
    id: 1, 
    name: "Morning Meditation", 
    streak: 12, 
    goal: 21, 
    today: false,
    icon: "🧘‍♀️",
    color: "#8B5CF6",
    timeOfDay: "morning",
    history: [true, true, true, false, true, true, true],
    description: "15 minutes of mindfulness to start the day",
    completionRate: 86,
  },
  { 
    id: 2, 
    name: "Reading", 
    streak: 8, 
    goal: 30, 
    today: false,
    icon: "📚",
    color: "#EC4899",
    timeOfDay: "evening",
    history: [true, true, false, true, true, true, false],
    description: "Read 20 pages of a book",
    completionRate: 71,
  },
  { 
    id: 3, 
    name: "Exercise", 
    streak: 5, 
    goal: 20, 
    today: false,
    icon: "🏃‍♂️",
    color: "#F59E0B",
    timeOfDay: "afternoon",
    history: [false, true, true, true, false, true, true],
    description: "30 minutes of cardio or strength training",
    completionRate: 65,
  },
  { 
    id: 4, 
    name: "Journaling", 
    streak: 15, 
    goal: 30, 
    today: false,
    icon: "✍️",
    color: "#10B981",
    timeOfDay: "evening",
    history: [true, true, true, true, true, false, true],
    description: "Write daily reflections and gratitude list",
    completionRate: 92,
  },
  { 
    id: 5, 
    name: "Drink Water", 
    streak: 20, 
    goal: 30, 
    today: false,
    icon: "💧",
    color: "#3B82F6",
    timeOfDay: "all-day",
    history: [true, true, true, true, true, true, true],
    description: "Drink 8 cups of water daily",
    completionRate: 97,
  },
  { 
    id: 6, 
    name: "No Sugar", 
    streak: 3, 
    goal: 14, 
    today: false,
    icon: "🍬",
    color: "#EF4444",
    timeOfDay: "all-day",
    history: [false, false, true, true, false, true, false],
    description: "Avoid processed sugar and sweets",
    completionRate: 38,
  },
];

// Define a Habit type
type Habit = {
  id: number;
  name: string;
  streak: number;
  goal: number;
  today: boolean;
  icon: string;
  color: string;
  timeOfDay: string;
  history: boolean[];
  description: string;
  completionRate: number;
};

// Badges and achievements data
const achievements = [
  {
    id: 1,
    name: "Early Bird",
    description: "Complete morning habits 7 days in a row",
    icon: "🌅",
    progress: 85,
    unlocked: true,
  },
  {
    id: 2,
    name: "Bookworm",
    description: "Read for 30 days in total",
    icon: "📖",
    progress: 60,
    unlocked: false,
  },
  {
    id: 3,
    name: "Zen Master",
    description: "Meditate for 21 days in a row",
    icon: "🧘",
    progress: 57,
    unlocked: false,
  },
  {
    id: 4,
    name: "Fitness Fanatic",
    description: "Exercise 5 times a week for 4 weeks",
    icon: "💪",
    progress: 45,
    unlocked: false,
  },
  {
    id: 5,
    name: "Hydration Hero",
    description: "Drink 8 cups of water for 30 days",
    icon: "🚰",
    progress: 95,
    unlocked: true,
  },
];

// User profile data
const userProfile = {
  name: "Alex Johnson",
  joinDate: "March 15, 2025",
  avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  timezone: "Pacific Time",
  level: 14,
  points: 3750,
  nextLevel: 4000,
  topHabit: "Journaling",
  topStreak: 15,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [waterIntake, setWaterIntake] = useState(5);
  const [sleepHours, setSleepHours] = useState(7.2);
  const [screenTime, setScreenTime] = useState(3.5);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitDetailOpen, setHabitDetailOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState("😊");
  const [moodNote, setMoodNote] = useState("");
  const [moodHistoryState, setMoodHistory] = useState(moodHistory);
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    icon: "✨",
    description: "",
    goal: 21,
    timeOfDay: "morning"
  });
  const [congratsMessage, setCongratsMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [waterGoal, setWaterGoal] = useState(8);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [screenTimeLimit, setScreenTimeLimit] = useState(4);
  
  // Set dark mode based on system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(darkModeQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      
      darkModeQuery.addEventListener("change", handleChange);
      return () => darkModeQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Demo feature: Random achievement notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.5) {
        const achievement = achievements.find(a => !a.unlocked);
        if (achievement) {
          setCongratsMessage(`You're close to unlocking "${achievement.name}"! Just ${100 - achievement.progress}% to go.`);
          setTimeout(() => setCongratsMessage(null), 5000);
        }
      }
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCheckIn = (id: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Calculate if streaks milestone reached
        const newStreak = habit.streak + 1;
        if (newStreak === habit.goal) {
          setTimeout(() => {
            setCongratsMessage(`🎉 Amazing! You've reached your goal of ${habit.goal} days for "${habit.name}"!`);
            setTimeout(() => setCongratsMessage(null), 5000);
          }, 500);
        }
        
        return { 
          ...habit, 
          today: true, 
          streak: newStreak,
          history: [...habit.history.slice(1), true],
          completionRate: Math.min(100, habit.completionRate + 2)
        };
      }
      return habit;
    }));
  };

  const submitMood = () => {
    const today = format(new Date(), "MMM d");
    const moodScores: Record<string, number> = {
      "😄": 5,
      "😊": 4,
      "😐": 3,
      "🙁": 2,
      "😢": 1,
    };
    
    setMoodHistory([
      { date: today, mood: currentMood, score: moodScores[currentMood], notes: moodNote },
      ...moodHistory
    ]);
    setMoodNote("");
    setShowMoodInput(false);
  };

  const addNewHabit = () => {
    if (newHabit.name) {
      const id = Math.max(...habits.map(h => h.id)) + 1;
      const newHabitEntry: Habit = {
        id,
        name: newHabit.name,
        streak: 0,
        goal: newHabit.goal,
        today: false,
        icon: newHabit.icon,
        color: getRandomColor(),
        timeOfDay: newHabit.timeOfDay,
        history: [false, false, false, false, false, false, false],
        description: newHabit.description || `Track your "${newHabit.name}" habit`,
        completionRate: 0,
      };
      
      setHabits([...habits, newHabitEntry]);
      setShowAddHabit(false);
      setNewHabit({
        name: "",
        icon: "✨",
        description: "",
        goal: 21,
        timeOfDay: "morning"
      });
    }
  };

  const getRandomColor = () => {
    const colors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#6366F1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculateMoodAverage = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, curr) => acc + curr.score, 0);
    return parseFloat((sum / moodHistory.length).toFixed(1));
  };
  
  const saveSettings = () => {
    setSettingsOpen(false);
    setCongratsMessage("Settings saved successfully!");
    setTimeout(() => setCongratsMessage(null), 3000);
  };

  const MOOD_COLORS = {
    "😄": "#10B981", // green
    "😊": "#60A5FA", // blue
    "😐": "#FBBF24", // yellow
    "🙁": "#F97316", // orange
    "😢": "#EF4444", // red
  };

  const renderGreeting = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";
    
    return `${greeting}, ${userProfile.name}`;
  };

  const renderDashboard = () => (
    <div className="w-full space-y-6">
      {/* Greeting and Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{renderGreeting()}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here&apos;s your daily progress</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{calculateMoodAverage()}/5</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Mood avg</div>
            </div>
            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">{habits.filter(h => h.today).length}/{habits.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
            </div>
            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(habits.reduce((acc, h) => acc + h.completionRate, 0) / habits.length)}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Success</div>
            </div>
          </div>
        </div>
          
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl mr-3">🏆</span>
              <div>
                <h3 className="font-medium">Current top streak</h3>
                <p className="text-lg font-bold">{userProfile.topHabit} ({userProfile.topStreak} days)</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => setAchievementsOpen(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm"
              >
                View Achievements
              </button>
            </div>
          </div>
        </div>
          
        {/* Health Stats */}
        <h3 className="text-xl font-semibold mb-4">Today&apos;s Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Sleep</h3>
              <span className="text-2xl">😴</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{sleepHours}h</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">/ {sleepGoal}h goal</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="12" 
              step="0.1" 
              value={sleepHours} 
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mt-1">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 font-medium">
              {sleepHours >= sleepGoal ? 
                "Great job! You reached your sleep goal." : 
                `${(sleepHours/sleepGoal*100).toFixed(0)}% of your daily goal`}
            </p>
          </div>
          
          <div className="flex flex-col bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 p-4 rounded-lg border border-cyan-100 dark:border-cyan-900/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">Water</h3>
              <span className="text-2xl">💧</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">{waterIntake}</span>
              <span className="text-sm text-cyan-600 dark:text-cyan-400">/ {waterGoal} cups</span>
            </div>
            <div className="flex w-full h-8 mb-2 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 ${i < waterIntake ? 'bg-cyan-500 dark:bg-cyan-600' : 'bg-gray-200 dark:bg-gray-700'} 
                    ${i > 0 ? 'border-l border-white dark:border-gray-800' : ''}`}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                className="flex-1 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
              >
                -1
              </button>
              <button 
                onClick={() => setWaterIntake(Math.min(waterGoal, waterIntake + 1))}
                className="flex-1 py-1 text-sm bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-800 dark:hover:bg-cyan-700 rounded transition-colors"
              >
                +1
              </button>
            </div>
          </div>
          
          <div className="flex flex-col bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Screen Time</h3>
              <span className="text-2xl">📱</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-orange-700 dark:text-orange-300">{screenTime}h</span>
              <span className="text-sm text-orange-600 dark:text-orange-400">/ {screenTimeLimit}h limit</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="12" 
              step="0.5" 
              value={screenTime} 
              onChange={(e) => setScreenTime(parseFloat(e.target.value))}
              className="w-full h-2 bg-orange-200 dark:bg-orange-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-orange-600 dark:text-orange-400 mt-1">
              <span>0h</span>
              <span>{screenTimeLimit}h</span>
              <span>12h</span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-2 font-medium">
              {screenTime <= screenTimeLimit ? 
                "You're below your screen time limit!" : 
                `${((screenTime - screenTimeLimit)/screenTimeLimit*100).toFixed(0)}% over your limit`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mood Tracking */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Mood Tracker</h2>
          <button 
            onClick={() => setShowMoodInput(!showMoodInput)}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-200 rounded-md transition-colors"
          >
            {showMoodInput ? "Cancel" : "Log Today's Mood"}
          </button>
        </div>
        
        <AnimatePresence>
          {showMoodInput && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex justify-between mb-4">
                  {["😄", "😊", "😐", "🙁", "😢"].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setCurrentMood(mood)}
                      className={`text-3xl p-2 rounded-full transition-all ${
                        currentMood === mood 
                          ? "bg-white dark:bg-gray-700 scale-110 shadow-md" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="How are you feeling today? (optional)"
                  className="w-full p-3 rounded-md border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows={2}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={submitMood}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
                  >
                    Save Mood
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Weekly average</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold mr-2">{calculateMoodAverage()}</span>
              <span className="text-2xl mb-1">/ 5</span>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Based on your last {moodHistory.length} mood logs
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-lg font-medium mb-3">Mood history</h3>
            <div className="overflow-x-auto">
              <div className="flex space-x-2 py-2 px-1 min-w-max">
                {moodHistory.slice(0, 7).map((entry, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-16 text-center"
                  >
                    <div 
                      style={{ backgroundColor: MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS] + '20' }}
                      className="aspect-square rounded-full flex items-center justify-center mb-1"
                    >
                      <span className="text-2xl">{entry.mood}</span>
                    </div>
                    <div className="text-xs font-medium">{entry.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Habits */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Daily Habits</h2>
          <button
            onClick={() => setShowAddHabit(true)}
            className="px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-200 rounded-md transition-colors"
          >
            + Add Habit
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <motion.div 
              key={habit.id}
              whileHover={{ y: -5 }}
              className={`p-5 rounded-lg border-2 ${
                habit.today 
                  ? `border-${habit.color.replace('#', '')} bg-${habit.color.replace('#', '')}/10` 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
              onClick={() => {
                setSelectedHabit(habit);
                setHabitDetailOpen(true);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span 
                    className="text-2xl mr-3 p-2 rounded-full" 
                    style={{ backgroundColor: habit.color + '30' }}
                  >
                    {habit.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold">{habit.name}</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {habit.timeOfDay === "morning" && "🌅 Morning"}
                      {habit.timeOfDay === "afternoon" && "☀️ Afternoon"}
                      {habit.timeOfDay === "evening" && "🌙 Evening"}
                      {habit.timeOfDay === "all-day" && "⏱️ All day"}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium px-2 py-1 rounded-full" style={{ backgroundColor: habit.color + '20', color: habit.color }}>
                  {habit.streak} days
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{habit.streak}/{habit.goal} days</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${(habit.streak / habit.goal) * 100}%`,
                      backgroundColor: habit.color
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-1">
                  {habit.history.map((day, i) => (
                    <div 
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        day ? `bg-${habit.color.replace('#', '')}` : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      style={{ backgroundColor: day ? habit.color : '' }}
                    ></div>
                  ))}
                </div>
                
                {!habit.today ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckIn(habit.id);
                    }}
                    className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
                  >
                    Check In
                  </button>
                ) : (
                  <div className="py-1 px-3 bg-green-500 text-white rounded-md text-sm">
                    ✓ Completed
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Habit placeholder card - shown when fewer than 3 habits */}
          {habits.length < 3 && (
            <div 
              onClick={() => setShowAddHabit(true)}
              className="p-5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="font-medium text-gray-600 dark:text-gray-300">Add New Habit</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                Track a new habit to improve your daily routine
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Weekly Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6">Weekly Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <h3 className="text-lg font-medium mb-2">Sleep Hours</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sleepData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }} 
                  formatter={(value) => [`${value} hours`, 'Sleep']}
                  labelFormatter={(label) => `${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8884d8" 
                  fill="url(#sleepGradient)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-64">
            <h3 className="text-lg font-medium mb-2">Water Intake</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }} 
                  formatter={(value) => [`${value} cups`, 'Water']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="cups" 
                  radius={[4, 4, 0, 0]}
                >
                  {waterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cups >= waterGoal ? "#3b82f6" : "#93c5fd"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-64 lg:col-span-2">
            <h3 className="text-lg font-medium mb-2">Screen Time & Habits Completed</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={screenTimeData.map((item, index) => ({
                  ...item,
                  habitsCompleted: Math.floor(Math.random() * 6) + 1 // Simulated data
                }))}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis yAxisId="left" stroke="#888" />
                <YAxis yAxisId="right" orientation="right" stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="hours" 
                  name="Screen Time (hours)"
                  stroke="#ef4444" 
                  fill="url(#screenGradient)" 
                  strokeWidth={2}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="habitsCompleted" 
                  name="Habits Completed"
                  stroke="#10b981" 
                  fill="url(#habitsGradient)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="habitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold">{Math.round(habits.reduce((acc, h) => acc + h.completionRate, 0) / habits.length)}%</span>
            <span className="ml-2 text-sm text-green-500">+3.2%</span>
          </div>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.round(habits.reduce((acc, h) => acc + h.completionRate, 0) / habits.length)}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold">{Math.max(...habits.map(h => h.streak))} days</span>
            <span className="ml-2 text-sm text-green-500">Best: {userProfile.topStreak}</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-xl mr-2">🔥</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Keep it going!</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold">{userProfile.level}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{userProfile.points} / {userProfile.nextLevel} XP</span>
          </div>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${(userProfile.points / userProfile.nextLevel) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Goal</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold">{habits.filter(h => h.today).length}/{habits.length}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">habits today</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-xl mr-2">🎯</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {habits.filter(h => !h.today).length > 0 ? 
                `${habits.filter(h => !h.today).length} habits left today` : 
                "All habits completed!"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="w-full space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-2">Your Analytics</h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">Track your long-term progress and identify patterns.</p>
        
        <div className="h-96 mb-8">
          <h3 className="text-lg font-medium mb-4">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { month: "Jan", sleep: 7.2, water: 6, screen: 4.5, habits: 68 },
                { month: "Feb", sleep: 7.5, water: 7, screen: 4.0, habits: 75 },
                { month: "Mar", sleep: 6.8, water: 5, screen: 4.8, habits: 62 },
                { month: "Apr", sleep: 7.0, water: 6, screen: 3.5, habits: 78 },
                { month: "May", sleep: 7.8, water: 7, screen: 3.0, habits: 85 }
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="sleep" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} name="Sleep (hrs)" />
              <Area type="monotone" dataKey="water" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Water (cups)" />
              <Area type="monotone" dataKey="screen" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Screen (hrs)" />
              <Area type="monotone" dataKey="habits" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Habits (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Habit Completion by Day</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { day: "Mon", completed: 83 },
                    { day: "Tue", completed: 72 },
                    { day: "Wed", completed: 91 },
                    { day: "Thu", completed: 65 },
                    { day: "Fri", completed: 78 },
                    { day: "Sat", completed: 92 },
                    { day: "Sun", completed: 87 }
                  ]}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`${value}%`, 'Completion Rate']}
                  />
                  <Bar dataKey="completed" name="Completion Rate">
                    {[
                      { day: "Mon", completed: 83 },
                      { day: "Tue", completed: 72 },
                      { day: "Wed", completed: 91 },
                      { day: "Thu", completed: 65 },
                      { day: "Fri", completed: 78 },
                      { day: "Sat", completed: 92 },
                      { day: "Sun", completed: 87 }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completed > 80 ? "#10b981" : entry.completed > 70 ? "#3b82f6" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Habit Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Morning", value: habits.filter(h => h.timeOfDay === "morning").length },
                      { name: "Afternoon", value: habits.filter(h => h.timeOfDay === "afternoon").length },
                      { name: "Evening", value: habits.filter(h => h.timeOfDay === "evening").length },
                      { name: "All Day", value: habits.filter(h => h.timeOfDay === "all-day").length },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#F59E0B" /> {/* Morning */}
                    <Cell fill="#3B82F6" /> {/* Afternoon */}
                    <Cell fill="#8B5CF6" /> {/* Evening */}
                    <Cell fill="#10B981" /> {/* All Day */}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`${value} habits`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Habit Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                outerRadius={90} 
                data={habits.map(h => ({ 
                  habit: h.name, 
                  completionRate: h.completionRate,
                  streak: h.streak / 2, // Scaled for visualization
                  goal: h.goal / 5 // Scaled for visualization
                }))}
              >
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="habit" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Completion Rate (%)" dataKey="completionRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Current Streak" dataKey="streak" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Sleep Day</h3>
          <div className="flex items-center mt-2">
            <span className="text-xl mr-2">🌙</span>
            <div>
              <div className="text-xl font-bold">Saturday</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">9.5 hours avg</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Sleep</h3>
          <div className="flex items-center mt-2">
            <span className="text-xl mr-2">😴</span>
            <div>
              <div className="text-xl font-bold">7.9 hours</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">This month</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Longest Streak</h3>
          <div className="flex items-center mt-2">
            <span className="text-xl mr-2">🏆</span>
            <div>
              <div className="text-xl font-bold">{habits.reduce((max, h) => Math.max(max, h.streak), 0)} days</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{habits.reduce((max, h) => h.streak > max.streak ? h : max, habits[0]).name}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Consistent</h3>
          <div className="flex items-center mt-2">
            <span className="text-xl mr-2">✅</span>
            <div>
              <div className="text-xl font-bold">{habits.reduce((max, h) => h.completionRate > max.completionRate ? h : max, habits[0]).name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{habits.reduce((max, h) => h.completionRate > max.completionRate ? h : max, habits[0]).completionRate}% completion</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Modal for viewing habit details
  const habitDetailModal = () => (
    habitDetailOpen && selectedHabit && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span 
                className="text-3xl p-3 rounded-full mr-3" 
                style={{ backgroundColor: selectedHabit.color + '30' }}
              >
                {selectedHabit.icon}
              </span>
              <h2 className="text-2xl font-bold">{selectedHabit.name}</h2>
            </div>
            <button 
              onClick={() => setHabitDetailOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</div>
            <p>{selectedHabit.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current streak</div>
              <div className="text-2xl font-bold">{selectedHabit.streak} days</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completion rate</div>
              <div className="text-2xl font-bold">{selectedHabit.completionRate}%</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Progress to goal</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="h-4 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                style={{ 
                  width: `${(selectedHabit.streak / selectedHabit.goal) * 100}%`,
                  backgroundColor: selectedHabit.color
                }}
              >
                {Math.round((selectedHabit.streak / selectedHabit.goal) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Weekly pattern</div>
            <div className="flex justify-between">
              {selectedHabit.history.map((day, i) => {
                const date = format(subDays(new Date(), 6 - i), "EEE");
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                        day 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {day ? "✓" : "✗"}
                    </div>
                    <span className="text-xs font-medium">{date}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Time of day</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center">
                <span className="text-xl mr-2">
                  {selectedHabit.timeOfDay === "morning" && "🌅"}
                  {selectedHabit.timeOfDay === "afternoon" && "☀️"}
                  {selectedHabit.timeOfDay === "evening" && "🌙"}
                  {selectedHabit.timeOfDay === "all-day" && "⏱️"}
                </span>
                <span className="capitalize">{selectedHabit.timeOfDay}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Goal</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center">
                <span className="text-xl mr-2">🎯</span>
                <span>{selectedHabit.goal} days</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              onClick={() => {
                setHabits(habits.filter(h => h.id !== selectedHabit.id));
                setHabitDetailOpen(false);
              }}
              className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Delete Habit
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setHabitDetailOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Close
              </button>
              {!selectedHabit.today && (
                <button
                  onClick={() => {
                    handleCheckIn(selectedHabit.id);
                    setHabitDetailOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  Check In
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );

  // Modal for settings
  const settingsModal = () => (
    settingsOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full mx-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button 
              onClick={() => setSettingsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl mr-3">🌓</span>
                  <span>Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Health Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Sleep Goal (hours)</label>
                    <span className="text-sm font-medium">{sleepGoal}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="12" 
                    step="0.5" 
                    value={sleepGoal} 
                    onChange={(e) => setSleepGoal(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Water Goal (cups)</label>
                    <span className="text-sm font-medium">{waterGoal} cups</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="12" 
                    step="1" 
                    value={waterGoal} 
                    onChange={(e) => setWaterGoal(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Screen Time Limit (hours)</label>
                    <span className="text-sm font-medium">{screenTimeLimit}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="8" 
                    step="0.5" 
                    value={screenTimeLimit} 
                    onChange={(e) => setScreenTimeLimit(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="font-medium">Daily Reminders</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Remind you to complete habits</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="font-medium">Weekly Reports</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Get weekly progress summary</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  );

  // Modal for user profile
  const profileModal = () => (
    profileOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full mx-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <button 
              onClick={() => setProfileOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <img 
                src={userProfile.avatar} 
                alt="User avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800"></div>
            </div>
            <h3 className="text-xl font-bold">{userProfile.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">Joined {userProfile.joinDate}</p>
            
            <div className="mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex items-center">
              <span className="mr-1">Level {userProfile.level}</span>
              <span className="text-xs">•</span>
              <span className="ml-1">{userProfile.points} XP</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timezone</div>
              <div className="font-medium flex items-center">
                <span className="mr-2">🕒</span>
                {userProfile.timezone}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Streak</div>
              <div className="font-medium flex items-center">
                <span className="mr-2">🔥</span>
                {userProfile.topStreak} days
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Level Progress</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                style={{ width: `${(userProfile.points / userProfile.nextLevel) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Level {userProfile.level}</span>
              <span>{userProfile.points} / {userProfile.nextLevel} XP</span>
              <span>Level {userProfile.level + 1}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <button
              className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Sign Out
            </button>
            <button
              onClick={() => {
                setProfileOpen(false);
                setSettingsOpen(true);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  );

  // Modal for achievements
  const achievementsModal = () => (
    achievementsOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Achievements</h2>
            <button 
              onClick={() => setAchievementsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Badges</h3>
              <div className="text-sm text-blue-500">
                {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Complete challenges to earn badges and rewards
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked 
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20" 
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 ${
                        achievement.unlocked 
                          ? "bg-yellow-100 dark:bg-yellow-900/40" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {achievement.name}
                        {achievement.unlocked && (
                          <span className="ml-2 text-yellow-500 dark:text-yellow-400">★</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                    <div 
                      className={`h-2 rounded-full ${
                        achievement.unlocked 
                          ? "bg-yellow-500" 
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {achievement.unlocked ? "Completed" : `${achievement.progress}% complete`}
                    </span>
                    {achievement.unlocked && (
                      <span className="text-yellow-500 dark:text-yellow-400">+500 XP</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-3">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["🌟 Marathon", "🧠 Mindfulness Guru", "💪 30-Day Challenge"].map((badge, index) => (
                <div 
                  key={index}
                  className="p-3 bg-gray-100 dark:bg-gray-700/40 rounded-lg text-center opacity-60"
                >
                  <div className="text-sm font-medium">{badge}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Unlocks next month</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setAchievementsOpen(false)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  );

  // Modal for adding new habit
  const addHabitModal = () => (
    showAddHabit && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Habit</h2>
            <button 
              onClick={() => setShowAddHabit(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g. Morning Meditation"
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {["✨", "🧘‍♀️", "📚", "🏃‍♂️", "💧", "🍎", "😴", "🧠", "📝", "🎮", "🚭", "🧹"].map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewHabit({...newHabit, icon})}
                    className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center ${
                      newHabit.icon === icon 
                        ? "bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500" 
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="Why do you want to build this habit?"
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={2}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time of Day
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {value: "morning", label: "Morning", icon: "🌅"},
                  {value: "afternoon", label: "Afternoon", icon: "☀️"},
                  {value: "evening", label: "Evening", icon: "🌙"},
                  {value: "all-day", label: "All Day", icon: "⏱️"}
                ].map((time) => (
                  <button
                    key={time.value}
                    onClick={() => setNewHabit({...newHabit, timeOfDay: time.value})}
                    className={`p-2 rounded-lg text-center ${
                      newHabit.timeOfDay === time.value
                        ? "bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500" 
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="text-xl mb-1">{time.icon}</div>
                    <div className="text-xs">{time.label}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal (Days)
              </label>
              <div className="flex items-center">
                <input
                  type="range" 
                  min="7" 
                  max="90" 
                  step="7" 
                  value={newHabit.goal} 
                  onChange={(e) => setNewHabit({...newHabit, goal: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-3 w-12 text-center">{newHabit.goal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>7 days</span>
                <span>30 days</span>
                <span>90 days</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddHabit(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addNewHabit}
              disabled={!newHabit.name}
              className={`px-6 py-2 rounded-md transition-colors ${
                newHabit.name
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Create Habit
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  );

  // Toast notification component
  const notificationToast = () => (
    congratsMessage && (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-md w-full mx-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-900 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                🎉
              </span>
            </div>
            <div className="ml-3">
              <p className="font-medium">{congratsMessage}</p>
              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5 }}
                  className="h-1.5 rounded-full bg-green-500"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  );

  // Navigation component
  const navigation = () => (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 z-40">
      <div className="max-w-3xl mx-auto flex justify-around">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === "dashboard" 
              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" 
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          }`}
        >
          <span className="text-xl mb-1">📊</span>
          <span className="text-xs">Dashboard</span>
        </button>
        
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === "analytics" 
              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" 
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          }`}
        >
          <span className="text-xl mb-1">📈</span>
          <span className="text-xs">Analytics</span>
        </button>
        
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex flex-col items-center px-4 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <span className="text-xl mb-1">⚙️</span>
          <span className="text-xs">Settings</span>
        </button>
        
        <button
          onClick={() => setProfileOpen(true)}
          className="flex flex-col items-center px-4 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <span className="text-xl mb-1">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-30">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📝</span>
            <h1 className="text-xl font-bold">HabitTracker</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setActiveTab(activeTab === "dashboard" ? "analytics" : "dashboard")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {activeTab === "dashboard" ? "📈" : "📊"}
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <button
              onClick={() => setProfileOpen(true)}
            >
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto p-4">
        {activeTab === "dashboard" ? renderDashboard() : renderAnalytics()}
      </main>
      
      <AnimatePresence>
        {habitDetailModal()}
        {settingsModal()}
        {profileModal()}
        {achievementsModal()}
        {addHabitModal()}
        {notificationToast()}
      </AnimatePresence>
      
      {navigation()}
    </div>
  );
}
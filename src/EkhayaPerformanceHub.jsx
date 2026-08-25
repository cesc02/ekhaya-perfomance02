import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, HeartPulse, Goal, ClipboardList, BarChart3,
  Users, Timer, Settings as SettingsIcon, Plus, X, ChevronRight,
  AlertTriangle, TrendingUp, TrendingDown, Minus, Activity,
  Calendar, MapPin, Shield, Star, Search, BookOpen, CreditCard,
  Wallet, DollarSign, Filter, Download, Upload
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, Cell
} from "recharts";

/* ---------------------------------------------------------
   EKHAYA FC — PERFORMANCE HUB
   Design tokens
   bg #0B0B0B · surface #141414 · surface2 #1C1C1C · border #2A2A2A
   gold #D4A843 · goldDim #B89038 · goldLight #F0D9A8 · danger #E4573D
   text #FFFFFF · muted #A0A0A0 · faint #6B6B60
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`;

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const COLORS = {
  bg: "#0B0B0B",
  surface: "#141414",
  surface2: "#1C1C1C",
  border: "#2A2A2A",
  gold: "#D4A843",
  goldDim: "#B89038",
  goldLight: "#F0D9A8",
  white: "#FFFFFF",
  danger: "#E4573D",
  text: "#FFFFFF",
  muted: "#A0A0A0",
  faint: "#6B6B6B",
};

/* ---------------- seed data ---------------- */

const INITIAL_PLAYERS = [
  { id: 1, number: 1, name: "T. Mbewe", position: "GK", age: 24, status: "available", fitness: 92, goals: 0, assists: 0, apps: 14, minutes: 1260, yellow: 1, red: 0 },
  { id: 2, number: 4, name: "K. Phiri", position: "CB", age: 27, status: "available", fitness: 88, goals: 1, assists: 0, apps: 15, minutes: 1350, yellow: 3, red: 0 },
  { id: 3, number: 5, name: "L. Banda", position: "CB", age: 29, status: "doubtful", fitness: 74, goals: 0, assists: 1, apps: 12, minutes: 1080, yellow: 4, red: 1 },
  { id: 4, number: 2, name: "J. Chirwa", position: "RB", age: 22, status: "available", fitness: 95, goals: 0, assists: 3, apps: 15, minutes: 1300, yellow: 2, red: 0 },
  { id: 5, number: 3, name: "M. Gondwe", position: "LB", age: 25, status: "injured", fitness: 40, goals: 0, assists: 2, apps: 9, minutes: 760, yellow: 1, red: 0 },
  { id: 6, number: 6, name: "P. Nyirenda", position: "CDM", age: 26, status: "available", fitness: 90, goals: 2, assists: 4, apps: 15, minutes: 1330, yellow: 2, red: 0 },
  { id: 7, number: 8, name: "D. Kaunda", position: "CM", age: 23, status: "available", fitness: 86, goals: 4, assists: 5, apps: 14, minutes: 1190, yellow: 1, red: 0 },
  { id: 8, number: 10, name: "E. Zulu", position: "CAM", age: 24, status: "available", fitness: 91, goals: 7, assists: 6, apps: 15, minutes: 1260, yellow: 0, red: 0 },
  { id: 9, number: 7, name: "S. Tembo", position: "RW", age: 21, status: "available", fitness: 89, goals: 6, assists: 4, apps: 13, minutes: 1050, yellow: 1, red: 0 },
  { id: 10, number: 11, name: "A. Mvula", position: "LW", age: 22, status: "doubtful", fitness: 68, goals: 5, assists: 3, apps: 12, minutes: 940, yellow: 2, red: 0 },
  { id: 11, number: 9, name: "F. Chulu", position: "ST", age: 26, status: "available", fitness: 93, goals: 11, assists: 2, apps: 15, minutes: 1280, yellow: 1, red: 0 },
  { id: 12, number: 14, name: "R. Msiska", position: "ST", age: 20, status: "available", fitness: 84, goals: 3, assists: 1, apps: 8, minutes: 410, yellow: 0, red: 0 },
];

const INITIAL_INJURIES = [
  { id: 1, playerId: 5, type: "Hamstring strain", grade: "Grade 2", occurred: "2026-08-10", expectedReturn: "2026-09-05", severity: "moderate", status: "active", notes: "Sustained during away fixture, pulled up after sprint in 2nd half." },
  { id: 2, playerId: 3, type: "Ankle sprain", grade: "Grade 1", occurred: "2026-08-18", expectedReturn: "2026-08-30", severity: "minor", status: "active", notes: "Rolled ankle in training, swelling managed, light jogging started." },
  { id: 3, playerId: 10, type: "Groin tightness", grade: "Monitoring", occurred: "2026-08-19", expectedReturn: "2026-08-27", severity: "minor", status: "active", notes: "Flagged by player post-session, reduced load this week." },
];

const INITIAL_MATCHES = [
  { id: 1, opponent: "Silver Strikers", date: "2026-08-16", competition: "Super League", venue: "home", scoreFor: 3, scoreAgainst: 1, possession: 58, shots: 14, shotsOnTarget: 7, notes: "Dominant second half, Chulu brace." },
  { id: 2, opponent: "Nyasa Big Bullets", date: "2026-08-09", competition: "Super League", venue: "away", scoreFor: 1, scoreAgainst: 1, possession: 46, shots: 8, shotsOnTarget: 3, notes: "Backline missed Gondwe, disciplined draw." },
  { id: 3, opponent: "Mighty Wanderers", date: "2026-08-02", competition: "Super League", venue: "home", scoreFor: 2, scoreAgainst: 0, possession: 61, shots: 16, shotsOnTarget: 9, notes: "Clean sheet, Zulu ran the midfield." },
  { id: 4, opponent: "Civil Sporting Club", date: "2026-07-26", competition: "Cup R2", venue: "away", scoreFor: 0, scoreAgainst: 1, possession: 52, shots: 10, shotsOnTarget: 2, notes: "Cup exit, wasteful in the final third." },
  { id: 5, opponent: "Moyale Barracks", date: "2026-07-19", competition: "Super League", venue: "home", scoreFor: 4, scoreAgainst: 2, possession: 55, shots: 18, shotsOnTarget: 10, notes: "End to end, Tembo hat-trick assist chain." },
];

const INITIAL_SESSIONS = [
  { id: 1, date: "2026-08-22", type: "Recovery", focus: "Pool + mobility", duration: 45, intensity: "low", attendance: 20, squad: 24, notes: "Post-match recovery for those who played 60+ mins." },
  { id: 2, date: "2026-08-21", type: "Tactical", focus: "Pressing triggers", duration: 75, intensity: "medium", attendance: 22, squad: 24, notes: "Video review then walkthrough vs upcoming opponent shape." },
  { id: 3, date: "2026-08-20", type: "Gym", focus: "Lower-body strength", duration: 50, intensity: "high", attendance: 18, squad: 24, notes: "Squat/hinge block, injured players on modified circuit." },
  { id: 4, date: "2026-08-19", type: "Training", focus: "Small-sided possession", duration: 80, intensity: "high", attendance: 21, squad: 24, notes: "4v4+2 rondos, sharp intensity ahead of weekend." },
];

const FITNESS_TREND = [
  { week: "Wk1", avg: 81 }, { week: "Wk2", avg: 83 }, { week: "Wk3", avg: 79 },
  { week: "Wk4", avg: 85 }, { week: "Wk5", avg: 84 }, { week: "Wk6", avg: 87 }, { week: "Wk7", avg: 85 },
];

/* ---------------- Cashbook 2026: Revenue Account ---------------- */
const DEPT_MAP = {
  "1": "Administration",
  "2": "Mens Team",
  "3": "Womens Team",
  "4": "Reserve Team",
  "5": "Youth Team",
  "6": "Transfers",
};

const EXPENSE_TYPE_MAP = {
  "1000": "International Transfers",
  "2102": "Training & Per Diem",
  "2103": "Camping",
  "2104": "Travel",
  "2105": "Travel & Meal Allowances",
  "2201": "Air Tickets",
  "2202": "Visa & Travel Docs",
  "2205": "Accommodation",
  "2301": "Utilities (ESCOM)",
  "2305": "Water Bills",
  "2306": "Internet & Airtime",
  "2402": "Logistics & Support",
  "2406": "Design & Branding",
  "2407": "Office Supplies",
  "2408": "Kits & Equipment",
  "2410": "Security Services",
  "2411": "Events & Ceremonies",
  "2420": "Media & Communications",
  "2501": "Medical Supplies",
  "2511": "Medical Aid (MASM)",
  "2517": "Medical Tests & Scans",
  "2601": "Office Rentals",
  "2603": "House Rentals",
  "2650": "Ground Rent",
  "2803": "Training & Development",
  "2819": "Monthly Training Allowance",
  "2902": "HR Retainer Fees",
  "2923": "IT & Web Maintenance",
  "3201": "Hostel Supplies (Food/Hygiene)",
  "3305": "Bank Charges & EFT Fees",
  "3353": "DSTV & Subscriptions",
  "3401": "Fuel",
  "3402": "Vehicle Licensing & COF",
  "3512": "Vehicle Maintenance",
  "3519": "Miscellaneous Expenses",
  "3901": "FIFA/FAM Fees",
  "4115": "Equipment Purchase",
  "4199": "Player Acquisition",
  "4685": "Bonuses & Rewards",
};

const RAW_CASHBOOK = [
  ["2026-01-01", "Online Banking Transfer | Ekhaya FC Budget", "Ekhaya FC Budget", "—", 15000000, 0],
  ["2026-01-01", "Online Banking Transfer | Funds Transfer from Revenue AC to", "Funds Transfer from Revenue AC to", "—", 4000000, 0],
  ["2026-01-01", "Mens Team Squad | Mens Team Travel Allowance BLK Trip", "EFC208-2104", "531196", 0, 940000],
  ["2026-01-01", "Up Town Lodge | Mens Team Accommodation Castel Cup Away in BLK", "EFC208-2205", "531125-1", 0, 1446292.5],
  ["2026-01-01", "Thando Mhango | CEO Travel Allowance Castel Cup Away in BLK", "EFC208-2105", "531125-2", 0, 100000],
  ["2026-01-01", "Mphatso Mpinganjira | Chairman Travel Allowance Castel Cup Away in BLK", "EFC208-2105", "531125-3", 0, 100000],
  ["2026-01-01", "EFC Supporters Committee | Travel Support Castel Cup Away in BLK", "EFC208-2102", "531125-4", 0, 500000],
  ["2026-01-01", "TotalEnergies Malawi | Fuel for Castel Cup trip for CEO & Chairman", "EFC208-3401", "531125-5", 0, 889327.46],
  ["2026-01-01", "Mens Team | Cowboys TPT 1 to 31 December 2025", "EFC202-2102", "531141", 0, 2765000],
  ["2026-01-01", "Transfer | Staff Fuel Allocations for January 2026", "EFC102-3401", "531217", 0, 2120000],
  ["2026-01-01", "Enos Chatama | Mens Coach Training Allowance for December 2025", "EFC202-2102", "531217", 0, 600000],
  ["2026-01-01", "Patricia Makwakwa | Training Allowance for December 2025", "EFC302-2102", "531217", 0, 150000],
  ["2026-01-01", "Alick Lungu | Training Allowance for December 2025", "EFC202-2102", "531217", 0, 150000],
  ["2026-01-01", "Mens Team Squad | Win n Clean Sheet Bonus vs Tigers TNM League", "EFC203-4685", "531219", 0, 3075000],
  ["2026-01-01", "Reserve Team Players | Reserve Team TPT 1 to 10 Jan 2026", "EFC402-2102", "531486", 0, 525500],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Secretariat", "EFC103-2511", "531508", 0, 609000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Mens Team", "EFC215-2511", "531508", 0, 2058000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Womens Team", "EFC315-2511", "531508", 0, 1075000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Reserve Team", "EFC415-2511", "531508", 0, 597000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Youth", "EFC515-2511", "531508", 0, 448000],
  ["2026-01-01", "Mobile Banking Transfer | From: WILLIAM MPINGANJIRA", "From: WILLIAM MPINGANJIRA", "—", 1000000, 0],
  ["2026-01-01", "Thando Mhango | Travel Allow CEO Lilongwe Official Trip", "EFC105-2104", "531858-1", 0, 280000],
  ["2026-01-01", "Target Travels & Tours | Air Ticket for CEO Lilongwe Official Trip", "EFC105-2201", "531858-2", 0, 424000],
  ["2026-01-01", "DSTV Malawi (Blessings) | DSTV Subscription for Cowboys Hostel (Jan-Mar 2026)", "EFC214-3353", "531692-1", 0, 270000],
  ["2026-01-01", "ESCOM (Blessings) | ESCOM Power Units for Cowboys Hostel Jan 2026", "EFC214-2301", "531692-2", 0, 100000],
  ["2026-01-01", "ESCOM (Blessings) | ESCOM Power Units for Cowgirls Hostel Jan 2026", "EFC314-2301", "531692-3", 0, 100000],
  ["2026-01-01", "Blantyre Water Board(Blessings) | Water Bill at Cowgirls Hostel for Nov 2025", "EFC314-2305", "531692-4", 0, 221444],
  ["2026-01-01", "Blantyre Water Board(Blessings) | Water Bill at Cowboys Hostel for Nov 2025", "EFC214-2305", "531692-5", 0, 139076],
  ["2026-01-01", "Smile Lodge | Accommodation for CEO", "EFC105-2205", "532409", 0, 100000],
  ["2026-01-01", "Online Banking Transfer | Ekhaya FC Ops", "Ekhaya FC Ops", "—", 7000000, 0],
  ["2026-01-01", "Thando Mhango | CEO Manager Mzuzu Scouting Trip", "EFC213-2104", "532949-1", 0, 380000],
  ["2026-01-01", "Francis Khan | Team Manager Mzuzu Scouting Trip", "EFC213-2104", "532949-2", 0, 210000],
  ["2026-01-01", "Chifundo Bonga | Driver Mzuzu Scouting Trip", "EFC213-2104", "532949-3", 0, 160000],
  ["2026-01-01", "TotalEnergies Malawi | Fuel for Mzuzu Scouting Trip", "EFC213-3401", "532949-4", 0, 767025],
  ["2026-01-01", "Tech Ideas | Website support Maintenance & SEO Jan-Mar 2026", "EFC108-2923", "533364-1", 0, 1860000],
  ["2026-01-01", "Studio Ignite | Design & Printing of Business cards for CEO plus email signature", "EFC108-2406", "533364-2", 0, 366200],
  ["2026-01-01", "Ravisha Rehab | MRI Scan for two Main Team Players", "EFC215-2517", "533629", 0, 800000],
  ["2026-01-01", "Shugo Electrical & Electronics | EFC 1 Aircon Gas Refilling", "EFC216-3512", "533897", 0, 700000],
  ["2026-01-01", "Online Banking Transfer | Ekhaya FC Budget", "Ekhaya FC Budget", "—", 20000000, 0],
  ["2026-01-01", "Ammon Chirwa | Petty Cash for Cowboys Castel Cup vs Shire Wimbe", "EFC208-2402", "534068-1", 0, 83000],
  ["2026-01-01", "Platinum Suits | Accommodation Cowboys Castel Cup vs Shire Wimbe", "EFC208-2205", "534068-2", 0, 4223340],
  ["2026-01-01", "TotalEnergies Malawi | Fuel Cowboys Castel Cup vs Shire Wimbe trip", "EFC208-3401", "534068-3", 0, 1467396.7],
  ["2026-01-01", "Thando Mhango | Travel Allowance CEO Wimbe Castel Cup Away", "EFC105-2104", "534070-1", 0, 180000],
  ["2026-01-01", "Mphatso Mpinganjira | Travel Allowance Chairman on Wimbe Castel Cup Away", "EFC105-2104", "534070-2", 0, 180000],
  ["2026-01-01", "EFC Supporters Committee | Support for supporters on Wimbe Castel Cup Away", "EFC292-3401", "534070-3", 0, 400000],
  ["2026-01-01", "TotalEnergies Malawi | Fuel for CEO & Chairman on Wimbe Castel Cup Away", "EFC105-3401", "534070-4", 0, 746550],
  ["2026-01-01", "Reserve Team Players | Reserve Team TPT 12 to 17 Jan 2026", "EFC402-2102", "534069", 0, 522500],
  ["2026-01-01", "Football Association of Malawi | 2026 Club License Application Fees", "EFC212-3901", "534148", 0, 300000],
  ["2026-01-01", "Youth Team Squad | Youth Team Bonus vs Young Stars", "EFC504-4685", "534054", 0, 160000],
  ["2026-01-01", "Mens Team Squad | Mens Travel Allow Castel vs S Wimbe", "EFC208-2104", "534077", 0, 980000],
  ["2026-01-01", "Transfer | January 2026 Petty Cash Expenses", "EFC214-3519", "534547", 0, 646125],
  ["2026-01-01", "Womens Team Players | Cowgirls TPT Back from Break", "EFC302-2102", "534543", 0, 1046000],
  ["2026-01-01", "Womens Team Players | Womens TPT 16 to 31 January 2026", "EFC302-2102", "534544", 0, 1568000],
  ["2026-01-01", "Thando Mhango | Refund on CEO Accommodation Castel Trip LL", "EFC105-2205", "534582", 0, 300000],
  ["2026-01-01", "Mens Team Squad | Win Bonuses vs Ntaja n Wimbe", "EFC208-4685", "535049", 0, 5225000],
  ["2026-01-01", "Youth Team Squad | Youth Team Bonus vs Yizo Yizo", "EFC504-4685", "535065", 0, 160000],
  ["2026-01-01", "Ammon Chirwa | Cowboys Hostel hygiene & food needs for January 2026", "EFC314-3201", "535275-1", 0, 1860200],
  ["2026-01-01", "DSTV Malawi (Blessings) | DSTV Subscription for Head Coach (Jan-Mar 2026)", "EFC214-3353", "535275-2", 0, 270000],
  ["2026-01-01", "Dr Kampondeni | MRI Scan results interpretation for Alick Lungu", "EFC215-2517", "535275-3", 0, 200000],
  ["2026-01-01", "Hope Chikumba | Passport fees support for Hope Chikumba", "EFC106-2411", "535275-4", 0, 120000],
  ["2026-01-01", "Kelvin Peter Zeka | Ground rent for Youth Team for Nov & Dec 2025", "EFC502-2650", "535275-5", 0, 160000],
  ["2026-01-01", "Telekom Networks Limited | Internet Bundles for media Team's mobile routers", "EFC108-2306", "535275-6", 0, 174000],
  ["2026-01-01", "Franklyn Silver | Refund of Car wash expenses on EFC 1 while away", "EFC108-2402", "535275-7", 0, 200000],
  ["2026-01-01", "Ammon Chirwa | Refund on fumigation services at new Cowboys Hostel", "EFC214-3519", "535275-8", 0, 140000],
  ["2026-01-01", "Blessings Gwembere | Refund Relocation of beds to the new Cowboys hostel", "EFC214-3519", "535275-9", 0, 100000],
  ["2026-01-01", "Raphael Dzonzi | Replica Jersey alteration charges", "EFC108-2402", "535275-10", 0, 200000],
  ["2026-01-01", "Samson Chiwambo | Relocation of DSTV gadgets to Chirimba", "EFC214-3353", "535275-11", 0, 140000],
  ["2026-01-01", "Online Banking Transfer | Funds Transfer from Revenue AC to", "Funds Transfer from Revenue AC to", "—", 22000000, 0],
  ["2026-01-01", "Mwayiwawo Moyo Tizola | Acquisition of Players: Sign on fee for Lucky Tizola", "EFC600-4199", "536019-1", 0, 4500000],
  ["2026-01-01", "Gift Chunga | Acquisition of Players: Sign on fee for Gift Chunga", "EFC600-4199", "536019-2", 0, 3000000],
  ["2026-01-01", "Womens Team Players | TPT Youth during Holidays", "EFC502-2102", "536274", 0, 558000],
  ["2026-01-01", "Prime Store.MW | Two iPad keyboards and stylus pens", "EFC600-4115", "536190-1", 0, 1350000],
  ["2026-01-01", "Hooked Up Security | Security Charges for December 2025", "EFC214-2410", "536190-2", 0, 2097000],
  ["2026-01-01", "Johnson Sekani | EFC Supporters Committee: Castel Cup vs Dedza", "EFC292-2411", "536190-3", 0, 1000000],
  ["2026-01-01", "Up Town Lodge | Mens Team Accommodation Castel Cup Away in BLK", "EFC208-2205", "536190-4", 0, 1306462.5],
  ["2026-01-01", "Ekhaya Food Shop (Gateway Mall) | Mens Team meals Castel Cup vs Shire Wimbe", "EFC208-2205", "536190-5", 0, 672560],
  ["2026-01-01", "Platinum Suits | Mens Team meals Castel Cup vs Shire Wimbe", "EFC208-2205", "536190-6", 0, 1035690],
  ["2026-01-01", "Youth Team Squad | Youth Team TPT support from 5th to 16 January 2026", "EFC502-2102", "535960", 0, 930000],
  ["2026-01-01", "Womens Team Players | Cowboys TPT support from 1 to 16 January 2026", "EFC202-2102", "535980", 0, 1970000],
  ["2026-01-01", "Online Banking Transfer | WCM Ops to FC Ops", "WCM Ops to FC Ops", "—", 10000000, 0],
  ["2026-01-01", "Online Banking Transfer | WCM Rev to EFC Ops", "WCM Rev to EFC Ops", "—", 30000000, 0],
  ["2026-01-01", "Thando Mhango | Special Castel Cup support vs Dedza", "EFC292-3401", "536591", 0, 800000],
  ["2026-01-01", "FDH bank | Bank service charges for january 2026", "EFC104-3305", "—", 0, 16300],
  ["2026-01-01", "Youth Team Squad | Youth Team TPT support from 19th to 31 January 2026", "EFC502-2102", "536636", 0, 1005000],
  ["2026-01-01", "Chrispin Chikwama | Professional HR Retainer Fees for January 2026", "EFC104-2902", "536710", 0, 800000],
  ["2026-01-01", "Youth Team Squad | Youth Team Bonus Win (2-0) vs Wanderers Youth", "EFC504-4685", "537469", 0, 160000],
  ["2026-01-01", "Womens Team Players | Womens Bonus Win (1-5) vs FOMO", "EFC304-4685", "537430", 0, 610000],
  ["2026-01-01", "Zito Auto Parts & Glass Centre | Spare parts (Fog Lights) for CEO's vehicle", "EFC116-3512", "537435-1", 0, 250000],
  ["2026-01-01", "Phatafuli Investments | Supply and delivery of Football pump & accessories", "EFC202-2402", "537435-2", 0, 170325],
  ["2026-01-01", "Mens Team Players | Cowboys TPT support from 19 to 26 January 2026", "EFC202-2102", "537514", 0, 1230000],
  ["2026-01-01", "Benard Chipeya | Supply and delivery of Cup game Kits & football boots", "EFC211-2408", "537112-1", 0, 4025000],
  ["2026-01-01", "Chilekeni Enterprises | Colour tonner cartridges & photocopying papers", "EFC107-2407", "537112-2", 0, 1210000],
  ["2026-01-01", "Alex & Paulina Katundu | House Rentals for Head Coach Jan - Mar 2026", "EFC214-2603", "537112-3", 0, 2400000],
  ["2026-01-01", "Corporate Graphics | Design for Ekhaya FC 2026 Season kits", "EFC108-2420", "537112-4", 0, 3495000],
  ["2026-01-01", "Unified Communications | Star-Link internet services Jan - March 2026", "EFC108-2306", "537112-5", 0, 450000],
  ["2026-01-01", "TotalEnergies Malawi | Fuel for Cowgirls trip to Zomba vs Zomba Lionesses", "EFC504-3401", "537112-6", 0, 170000],
  ["2026-01-01", "Aisha Sattar | Hosting & resting Mens Team vs Tigers", "EFC203-2205", "537112-7", 0, 500000],
  ["2026-01-01", "Aisha Sattar | Relocation of Cowboys stuff to Chirimba", "EFC214-3519", "537112-8", 0, 450000],
  ["2026-01-01", "Thando Mhango | Refund on purchase of stamina supplement for Cowboys", "EFC214-3519", "537112-9", 0, 283100],
  ["2026-01-01", "George Musta Taumbe | Refund Airticket for E. Saviel Jr going back to Lusaka", "EFC213-2201", "537112-10", 0, 1247700],
  ["2026-01-01", "Ammon Chirwa | Cowgirls Hostel hygiene & food needs for January 2026", "EFC314-3201", "537112-11", 0, 2121200],
  ["2026-01-01", "Top Lodges | Mens Team camping for Castel Cup vs Dedza", "EFC207-2205", "537112-12", 0, 2000000],
  ["2026-01-01", "Ammon Chirwa | Refund on EFC 1 Aircon Gas refill charges", "EFC216-3512", "537112-13", 0, 475000],
  ["2026-01-01", "Mens Team Players | Selected Mens Team Players TPT Support to Holiday", "EFC202-2102", "537621", 0, 410000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Secretariat", "EFC103-2511", "538570", 0, 609000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Mens Team", "EFC215-2511", "538570", 0, 2019000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Womens Team", "EFC315-2511", "538570", 0, 1075000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Reserve Team", "EFC415-2511", "538570", 0, 597000],
  ["2026-01-01", "Medical Aid Society of Malawi | MASM Cover for February 2026 - Youth", "EFC515-2511", "538570", 0, 448000],
  ["2026-02-01", "TotalEnergies Malawi | Feb 2026 monthly Fuel for Secretariat", "EFC102-3401", "539843-1", 0, 1415025],
  ["2026-02-01", "TotalEnergies Malawi | Feb 2026 monthly Fuel for Mens Team Technical", "EFC202-3401", "539843-1", 0, 1588800],
  ["2026-02-01", "Enos Chatama | Feb 2026 monthly Training Allowance for H/Coach", "EFC202-2102", "539843-2", 0, 600000],
  ["2026-02-01", "Alick Lungu | Feb 2026 monthly Training Allowance for players", "EFC302-2819", "539843-3", 0, 150000],
  ["2026-02-01", "Patricia Makwakwa | Feb 2026 monthly Training Allowance Cowgirls Coach", "EFC202-2819", "539843-4", 0, 150000],
  ["2026-02-01", "Muhamed Mohamed | M/Vehicle maintenance tyres for BT 14727", "EFC216-3512", "539941-1", 0, 759996],
  ["2026-02-01", "Phrmaprime Pharmacy | Purchase of medical drugs", "EFC215-2501", "539941-2", 0, 770300],
  ["2026-02-01", "Bvumbwe Auto Parts | M/Vehicle maintenance bearing for BT 13415", "EFC416-3512", "539941-3", 0, 750000],
  ["2026-02-01", "Blessings Gwembere | DSTV for Cowgirls hostel - Feb to April 2026", "EFC314-3353", "539941-4", 0, 270000],
  ["2026-02-01", "Womens Team Players | Womens TPT 3 to 14 February 2026", "EFC302-2102", "540357", 0, 1542000],
  ["2026-02-01", "Youth Team Squad | Youth TPT 3rd to 14th February 2026", "EFC502-2102", "540345", 0, 1096000],
  ["2026-02-01", "Davie Matemba | Purchase of Football Boots for Cowgirls", "EFC311-2408", "540432-1", 0, 780000],
  ["2026-02-01", "Edmand Mapulanga | Laundry charges for Reserve Team Kit", "EFC208-2402", "540432-2", 0, 150000],
  ["2026-02-01", "Only Banda | Laundry charges for Mens Team Kit", "EFC404-2402", "540432-3", 0, 120000],
  ["2026-02-01", "Brian Ndawanje | Dwelling house rentals for Cowgirls hostel Jan-Mar 2026", "EFC314-2603", "540432-4", 0, 1440000],
  ["2026-02-01", "TotalEnergies Malawi | Fuel for Cowgirls Zomba trip", "EFC404-3401", "540432-5", 0, 198153.15],
  ["2026-02-01", "Ronald Chimchere | Refund on freight charges for Jersey & kits sample (China)", "EFC600-1000", "540432-6", 0, 1450073.14],
  ["2026-02-01", "Malamulo Nursing Hospital | Tuition Fees for Patrick Dominic", "EFC403-4685", "540432-7", 0, 960500],
  ["2026-02-01", "Francho Auto Parts | M/Vehicle maintenance: Car battery for BT 14727", "EFC216-3512", "540432-8", 0, 500000],
  ["2026-02-01", "Online Banking Transfer | Funds Transfer from Revenue AC to", "Funds Transfer from Revenue AC to", "—", 2000000, 0],
  ["2026-02-01", "Bank Accounts | Travel & Meal allowances: Chairman, CEO & Team Manager LL trip", "EFC213-2105", "541130", 0, 690000],
  ["2026-02-01", "TotalEnergies Malawi | Travel & Meal allowances: Chairman, CEO & Team Manager LL trip", "EFC213-3401", "541130", 0, 1139467.5],
  ["2026-02-01", "Online Banking Transfer | Luso to Ekhaya FC Ops", "Luso to Ekhaya FC Ops", "—", 12139467.5, 0],
  ["2026-02-01", "Transfer | Purchase of player Wonderful Genala", "EFC600-4199", "543103", 0, 1200000],
  ["2026-02-01", "Salary Charges | Chg EFT OtherBank - Batch 543103", "EFC104-3305", "543103", 0, 500],
  ["2026-02-01", "Transfer | 2026 Club Licencing Lilongwe Trip", "EFC105-3401", "543079", 0, 1569733.75],
  ["2026-02-01", "Salary Charges | Chg EFT OtherBank - Batch 543079", "EFC104-3305", "543079", 0, 500],
  ["2026-02-01", "Mobile Banking Transfer | From: AMON CHIRWA", "From: AMON CHIRWA", "—", 270000, 0],
  ["2026-02-01", "Transfer In | THANDO KASO MHAN", "THANDO KASO MHAN", "—", 270000, 0],
  ["2026-02-01", "Transfer | Youth Team Bonus vs Agumbala", "EFC503-4685", "543197", 0, 160000],
  ["2026-02-01", "Transfer | Womens Bonus Wins Zomba n Ndirande", "EFC304-4685", "543302", 0, 3650000],
  ["2026-02-01", "Transfer | Womens TPT 17 to 28 February 2026", "EFC302-2102", "543999", 0, 1508000],
  ["2026-02-01", "Transfer | Youth Bonus Win vs Airsport FC", "EFC504-4685", "544000", 0, 190000],
  ["2026-02-01", "Transfer | Feb 2026 WK1 Operations Budget A", "EFC515-2511", "544017", 0, 2112527.2],
  ["2026-02-01", "Salary Charges | Chg EFT OtherBank - Batch 544017", "EFC104-3305", "544017", 0, 1000],
  ["2026-02-01", "Transfer | Air Ticket fare Refund LL BT LL", "EFC105-2201", "544350", 0, 351000],
  ["2026-02-01", "Transfer | Womens Player Transfer Fees", "EFC600-4199", "544647", 0, 600000],
  ["2026-02-01", "Salary Charges | Chg EFT OtherBank - Batch 544647", "EFC104-3305", "544647", 0, 1600],
  ["2026-02-01", "Transfer | Media Team Allowance Online Article", "EFC108-2420", "544638", 0, 200000],
  ["2026-02-01", "Online Banking Transfer | WCM Ops to FC Ops", "WCM Ops to FC Ops", "—", 15000000, 0],
  ["2026-02-01", "Transfer | Player contract negotiation fees", "EFC600-4199", "545406", 0, 1000000],
  ["2026-02-01", "Salary Charges | Chg EFT OtherBank - Batch 545406", "EFC104-3305", "545406", 0, 800],
  ["2026-02-01", "Transfer | Feb 2026 WK3 Operations", "EFC515-2511", "—", 0, 6820000],
  ["2026-02-01", "Salary Charges | Charge EFT - Batch 545508", "EFC104-3305", "545508", 0, 2400],
  ["2026-02-01", "Transfer | EFC Manager n Coach Castel Finals", "EFC206-3401", "545639", 0, 923667.5],
  ["2026-02-01", "Nazil Kalos | Vehicle licensing (COF) BT14727 & BT 14713", "EFC217-3402", "545710", 0, 122000],
  ["2026-02-01", "Nazil Kalos | Mens Gym equipment - Relocation to Chirimba", "EFC217-3402", "545710", 0, 298000],
  ["2026-02-01", "Oakmont Resort | Accomm for CEO, Chairman & Legal counsel AGM in SA", "EFC217-3402", "545710", 0, 600000],
  ["2026-02-01", "Kelvin Peter Zeka | Youth Team Ground rent Jan & Feb 2026", "EFC217-3402", "545710", 0, 160000],
  ["2026-02-01", "Ammon Chirwa | Meals for the Cowgirls playing Nsuwadzi in Mulanje", "EFC217-3402", "545710", 0, 330000],
  ["2026-02-01", "Ammon Chirwa | Cowgirls Match day transport for medical team", "EFC217-3402", "545710", 0, 10000],
  ["2026-02-01", "TotalEnergies Malawi | Fuel for Cowgirls trip to Nsuwadzi", "EFC217-3402", "545710", 0, 286710.31],
  ["2026-02-01", "FDH Bank for MRA | FDH transfer levies", "EFC104-3305", "545710", 0, 3200],
  ["2026-02-01", "FDH Bank | Bank Charges", "EFC104-3305", "—", 0, 16300],
  ["2026-02-01", "Edu & Work Connect | Air Ticket for Technical Director", "EFC213-2201", "547163", 0, 1992835],
  ["2026-02-01", "FDH Bank for MRA | FDH transfer levies", "EFC104-3305", "547163", 0, 800],
  ["2026-02-01", "Transfer | Vehicle Repairs : BZ 20442", "EFC216-3512", "547179", 0, 588000],
  ["2026-02-01", "FDH Bank for MRA | FDH transfer levies", "EFC104-3305", "547179", 0, 800],
  ["2026-02-01", "EFT Incoming | Standard Bank - SUPER LEAGUE ASSOCIATION", "Super League", "—", 1055354, 0],
  ["2026-02-01", "Transfer | Chair CEO n Legal on SULOM AGM Trip", "EFC105-3401", "547519", 0, 1867577.5],
  ["2026-02-01", "FDH Bank for MRA | FDH transfer levies", "EFC104-3305", "547519", 0, 1600],
  ["2026-03-01", "Ammon Chirwa | Cowgirls Hostel food needs", "EFC314-3201", "548752", 0, 323526.6],
  ["2026-03-01", "Total Energies Malawi Marketing Ltd | Fuel for Cowgirls away game Bvumbwe", "EFC304-3401", "—", 0, 175000],
  ["2026-03-01", "Blantyre Water Board | Water Bills for Cowgirls Hostel", "EFC314-2305", "—", 0, 168130],
  ["2026-03-01", "TMT Transport | Maize transportation to warehouse", "Maize transport", "—", 0, 200000],
  ["2026-03-01", "Nazil Kalos | Motor Vehicle COF", "Motor Vehicle COF", "—", 0, 240000],
  ["2026-03-01", "Salary Charges | Charge EFT - Batch 548752", "EFC104-3305", "548752", 0, 1600],
  ["2026-03-01", "Transfer In | FUNDS TRANSFER from Acc.No. 1850000151391", "FUNDS TRANSFER", "—", 50000000, 0],
  ["2026-03-01", "Masimba Consulting | HR Retainer Fees for February 2026", "EFC104-2902", "550176", 0, 800000],
  ["2026-03-01", "EM Auto Parts | Service Parts for BT 13415", "EFC216-3512", "550633", 0, 700000],
  ["2026-03-01", "EM Auto Parts | Service Parts for BR 7624", "EFC216-3512", "—", 0, 178000],
  ["2026-03-01", "EM Auto Parts | Service Parts for BT 14955", "EFC316-3512", "—", 0, 660000],
  ["2026-03-01", "Bvumbwe Auto Parts | Engine Oil for EFC 1", "EFC216-3512", "—", 0, 300000],
  ["2026-03-01", "Salary Charges | Chg EFT OtherBank - Batch 550633", "EFC104-3305", "550633", 0, 3200],
  ["2026-03-01", "Total Energies Malawi Marketing Ltd | Monthly fuel allocation Management team", "EFC102-3401", "550637", 0, 595800],
  ["2026-03-01", "Total Energies Malawi Marketing Ltd | Monthly fuel expenditure Utility", "EFC107-3401", "550637", 0, 1381249.85],
  ["2026-03-01", "Total Energies Malawi Marketing Ltd | Monthly fuel allocation technical team", "EFC202-3401", "550637", 0, 993000],
  ["2026-03-01", "Enos Chatama | Monthly training allowance for Feb 2026", "EFC202-2819", "550637", 0, 150000],
  ["2026-03-01", "Alick Lungu | Monthly training allowance for Feb 2026", "EFC202-2819", "550637", 0, 150000],
  ["2026-03-01", "Transfer | Womens Bonus Wins Nsuwazi n Bvumbwe", "EFC304-4685", "550773", 0, 3290000],
  ["2026-03-01", "Transfer | Womens TPT 2 to 8 March 2026", "EFC302-2102", "550866", 0, 1021000],
  ["2026-03-01", "Salary Charges | Charge EFT - Batch 550637", "EFC104-3305", "550637", 0, 800],
  ["2026-03-01", "Oneclick Bulk Payment | FUNDS TRANSFER", "FUNDS TRANSFER", "—", 111495452.91, 0],
  ["2026-03-01", "Account Transfer Charges | AC-1860000006486", "EFC600-1000", "—", 0, 106900],
  ["2026-03-01", "Funds Transfer | EUR34500.71 to CROWN AGENTS BANK EUR CURRENT", "EFC600-1000", "—", 0, 111340553.31],
  ["2026-03-01", "Account Transfer Charges | AC-1860000006467", "EFC600-1000", "—", 0, 10506],
  ["2026-03-01", "Funds Transfer | USDCHG CONV to CROWN AGENTS BANK USD CURRENT", "EFC600-1000", "—", 0, 52530],
  ["2026-03-01", "Funds Transfer | USD35 to CROWN AGENTS BANK USD CURRENT", "EFC600-1000", "—", 0, 61285],
  ["2026-03-01", "Transfer | Advanced Leadership Prog TFM Centre", "EFC102-2803", "551187", 0, 5000000],
  ["2026-03-01", "FDH Properties | Rentals Ekhaya Football Club offices Jan-Mar 2026", "EFC107-2601", "551543", 0, 1917077.43],
  ["2026-03-01", "Hooked up Security | Security Charges February 2026 H/Coach's residence", "EFC202-2410", "551543", 0, 2115000],
  ["2026-03-01", "Hooked up Security | Security Charges February 2026 Cowgirls hostel", "EFC314-2410", "551543", 0, 2115000],
  ["2026-03-01", "Ammon Chirwa | Hostel needs for Cowgirls", "EFC214-3201", "551543", 0, 1517100],
  ["2026-03-01", "Blessing Gwembere | ESCOM units for Cowboys hostel", "EFC214-2301", "551543", 0, 100000],
  ["2026-03-01", "Blessing Gwembere | ESCOM units for Cowgirls hostel", "EFC314-2301", "551543", 0, 100000],
  ["2026-03-01", "Blessing Gwembere | ESCOM units for EFC Offices (Kristwick)", "EFC107-2301", "551543", 0, 120000],
  ["2026-03-01", "BB Engineering | Motor Vehicle maintenances - EFC 1", "EFC216-3512", "551543", 0, 2589000],
  ["2026-03-01", "BB Engineering | Motor Vehicle Repair services - labour BT 14955", "EFC316-3512", "551543", 0, 330000],
  ["2026-03-01", "BB Engineering | Motor Vehicle Repair services - labour BT 13415", "EFC416-3512", "551543", 0, 330000],
  ["2026-03-01", "BB Engineering | Motor Vehicle maintenances - BR 7624", "EFC216-3512", "551543", 0, 500000],
  ["2026-03-01", "BB Engineering | Motor Vehicle New tyres for - BT 14727", "EFC316-3512", "551543", 0, 869500],
  ["2026-03-01", "Brian Ndawanje | Rentals Cowgirls hostel Top up Jan-Mar 2026", "EFC314-2603", "551543", 0, 360000],
  ["2026-03-01", "Salary Charges | Bank Charges", "EFC104-3305", "551543", 0, 1600],
  ["2026-03-01", "Transfer | Technical Director House Rentals", "EFC202-2603", "552185", 0, 6000000],
  ["2026-03-01", "MASM - Blantyre | Medical Cover for March 2026 : Secretariat", "EFC103-2511", "552194", 0, 609000],
  ["2026-03-01", "MASM - Blantyre | Medical Cover for March 2026 : Cowboys", "EFC215-2511", "552194", 0, 2135000],
  ["2026-03-01", "MASM - Blantyre | Medical Cover for March 2026 : Cowgirls", "EFC315-2511", "552194", 0, 1075000],
  ["2026-03-01", "MASM - Blantyre | Medical Cover for March 2026 : Reserve", "EFC415-2511", "552194", 0, 597000],
  ["2026-03-01", "MASM - Blantyre | Medical Cover for March 2026 : Youth", "EFC515-2511", "552194", 0, 448000],
  ["2026-03-01", "Transfer | Cowboys TPT 4 to 27 March 2026", "EFC202-2102", "552485", 0, 2320000],
  ["2026-03-01", "Transfer | March 2026 WK2 2026 Supp Budget", "EFC213-2205", "552682", 0, 764000],
  ["2026-03-01", "Salary Charges | Chg EFT OtherBank", "EFC104-3305", "552682", 0, 1600],
  ["2026-03-01", "Transfer | Chair CEO n Legal on SULOM AGM Trip", "EFC105-2104", "553017", 0, 500000],
  ["2026-03-01", "Ammon for TD | Technical Director Expenses Processing Work Permit", "EFC103-2201", "553324", 0, 516203.75],
  ["2026-03-01", "Ammon for TD | Technical Director Expenses Processing Work Permit", "EFC103-2202", "553324", 0, 1751000],
  ["2026-03-01", "Francis Khan | Full Day training expenses for Cowboys", "EFC202-2411", "553382", 0, 689880],
  ["2026-03-01", "Francis Khan | Full Day training expenses for Cowboys", "EFC202-2411", "553382", 0, 960000],
  ["2026-03-01", "Transfer | Players Medical Tests March 2026", "EFC215-2517", "554512", 0, 1615000],
  ["2026-03-01", "Salary Charges | Chg EFT OtherBank - Batch 554512", "EFC104-3305", "554512", 0, 800],
  ["2026-03-01", "Transfer In | CHILOBWE UNITED", "CHILOBWE UNITED", "—", 500000, 0],
  ["2026-03-01", "Transfer | HR Retainer Fees for March 2026", "EFC104-2902", "555918", 0, 800000],
  ["2026-03-01", "Fees Debited | 1910000195197", "EFC104-3305", "—", 0, 17930],
  ["2026-03-01", "Online Banking Transfer | Funds Transfer from Revenue AC to", "Funds Transfer from Revenue AC to", "—", 13800000, 0],
  ["2026-03-01", "Transfer | Cowboys Travel Allowance Sapitwa", "EFC202A-2104", "556678", 0, 890000],
  ["2026-03-01", "Transfer | Cowboys Sapitwa Trip", "EFC202A-3401", "556676", 0, 5317648],
  ["2026-03-01", "Salary Charges | Bank Charges", "EFC104-3305", "556676", 0, 800],
  ["2026-03-01", "Transfer | Chair CEO n Co on Sapitwa Trip", "EFC105-3401", "557073", 0, 1916835],
  ["2026-03-01", "Salary Charges | Chg EFT OtherBank - Batch 557073", "EFC104-3305", "557073", 0, 1600],
];

const _PAYMENTS = RAW_CASHBOOK.filter(r => r[5] > 0);
const _DEPOSITS = RAW_CASHBOOK.filter(r => r[4] > 0);
const OPENING_BALANCE = 19571.81;
const TOTAL_DEPOSITS = _DEPOSITS.reduce((s, r) => s + r[4], 0);
const TOTAL_PAYMENTS = _PAYMENTS.reduce((s, r) => s + r[5], 0);

function parseAccountCode(code) {
  if (!code || !code.startsWith("EFC")) return null;
  const m = code.match(/EFC(\d)(\d{2})[A-Z]?-(\d{4})/);
  if (!m) return null;
  const deptKey = m[1];
  const suffix = m[3];
  const dept = DEPT_MAP[deptKey] || `Dept ${deptKey}`;
  const expense = EXPENSE_TYPE_MAP[suffix] || `Type ${suffix}`;
  return { dept, expense, deptKey, suffix };
}

const INITIAL_CASHBOOK = RAW_CASHBOOK.map((r, i) => {
  const [date, desc, detail, chq, deposit, payment] = r;
  const isDeposit = deposit > 0;
  const parsed = parseAccountCode(detail);
  return {
    id: i + 1,
    date,
    description: desc.split(" | ")[1] || desc,
    payee: desc.split(" | ")[0] || "",
    details: detail,
    chequeNo: chq,
    deposit,
    payment,
    balance: 0,
    isDeposit,
    parsed,
    deptKey: parsed?.deptKey || "",
    suffix: parsed?.suffix || "",
  };
});

let _bal = OPENING_BALANCE;
INITIAL_CASHBOOK.forEach(tx => {
  _bal += tx.deposit - tx.payment;
  tx.balance = Math.round(_bal * 100) / 100;
});

/* ---------- Revenue Account Summary helpers ---------- */
function getMonthlySummary() {
  const months = {};
  INITIAL_CASHBOOK.forEach(tx => {
    const m = tx.date.slice(0, 7);
    if (!months[m]) months[m] = { month: m, deposits: 0, payments: 0, count: 0 };
    months[m].deposits += tx.deposit;
    months[m].payments += tx.payment;
    months[m].count++;
  });
  return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
}

function getCategorySummary() {
  const cats = {};
  INITIAL_CASHBOOK.forEach(tx => {
    if (tx.isDeposit) {
      const key = tx.parsed?.dept || "Other Deposits";
      if (!cats[key]) cats[key] = { category: key, deposits: 0, payments: 0 };
      cats[key].deposits += tx.deposit;
    } else {
      const key = tx.parsed ? `${tx.parsed.dept} - ${tx.parsed.expense}` : tx.description;
      if (!cats[key]) cats[key] = { category: key, deposits: 0, payments: 0 };
      cats[key].payments += tx.payment;
    }
  });
  return Object.values(cats).filter(c => c.deposits > 0 || c.payments > 0).sort((a, b) => (b.deposits + b.payments) - (a.deposits + a.payments));
}

function getDeptSummary() {
  const depts = {};
  INITIAL_CASHBOOK.forEach(tx => {
    const dept = tx.parsed?.dept || (tx.isDeposit ? "Deposits" : "Unallocated");
    if (!depts[dept]) depts[dept] = { dept, deposits: 0, payments: 0 };
    depts[dept].deposits += tx.deposit;
    depts[dept].payments += tx.payment;
  });
  return Object.values(depts).sort((a, b) => (b.deposits - b.payments) - (a.deposits - a.payments));
}
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "medical", label: "Medical", icon: HeartPulse },
  { key: "logmatch", label: "Log Match", icon: Goal },
  { key: "reports", label: "Match Reports", icon: ClipboardList },
  { key: "analysis", label: "Analysis", icon: BarChart3 },
  { key: "revenue", label: "Revenue", icon: Wallet },
  { key: "players", label: "Players", icon: Users },
  { key: "sessions", label: "Sessions", icon: Timer },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const STATUS_META = {
  available: { color: COLORS.gold, label: "Available" },
  doubtful: { color: COLORS.goldLight, label: "Doubtful" },
  injured: { color: COLORS.danger, label: "Injured" },
};

/* ---------------- small building blocks ---------------- */

function Badge({ number, size = 34, color = COLORS.gold }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `2px solid ${color}`, color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Oswald', sans-serif", fontWeight: 600,
        fontSize: size * 0.42, flexShrink: 0, background: "rgba(255,255,255,0.02)",
      }}
    >
      {number}
    </div>
  );
}

function StatusDot({ status }) {
  const m = STATUS_META[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: m.color, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
      {m.label}
    </span>
  );
}

function Card({ children, style, title, eyebrow, right }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 10, padding: 18, ...style,
    }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            {eyebrow && <div style={{ fontSize: 11, letterSpacing: "0.12em", color: COLORS.faint, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: "uppercase" }}>{eyebrow}</div>}
            {title && <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.text, letterSpacing: "0.01em" }}>{title}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function ScoreDigit({ label, value, accent = COLORS.gold }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 700,
        color: accent, textShadow: `0 0 18px ${accent}55`, lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 10, color: COLORS.faint, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>{label}</div>
    </div>
  );
}

function Pill({ children, color = COLORS.gold, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
      color, background: bg || `${color}1A`, border: `1px solid ${color}44`,
      fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: COLORS.muted, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 7,
  padding: "9px 11px", color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif",
  outline: "none",
};

/* ================================================================
   CASHBOOK REVENUE 2025
=============================================================== */

function RevenueCashbook() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", dir: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSummary, setShowSummary] = useState("transactions");
  const PER_PAGE = 25;

  const monthlySummary = useMemo(() => getMonthlySummary(), []);
  const categorySummary = useMemo(() => getCategorySummary(), []);
  const deptSummary = useMemo(() => getDeptSummary(), []);

  const months = [...new Set(INITIAL_CASHBOOK.map(tx => tx.date.slice(0, 7)))].sort();
  const departments = [...new Set(INITIAL_CASHBOOK.map(tx => tx.parsed?.dept).filter(Boolean))].sort();

  const filtered = useMemo(() => {
    let rows = [...INITIAL_CASHBOOK];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(tx =>
        tx.payee.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.details.toLowerCase().includes(q) ||
        tx.date.includes(q) ||
        tx.chequeNo.toLowerCase().includes(q)
      );
    }
    if (typeFilter === "deposits") rows = rows.filter(tx => tx.isDeposit);
    else if (typeFilter === "payments") rows = rows.filter(tx => !tx.isDeposit);
    if (deptFilter !== "all") rows = rows.filter(tx => tx.parsed?.dept === deptFilter);
    if (monthFilter !== "all") rows = rows.filter(tx => tx.date.startsWith(monthFilter));
    rows.sort((a, b) => {
      const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (typeof aVal === "string") return sortConfig.dir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortConfig.dir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return rows;
  }, [search, typeFilter, deptFilter, monthFilter, sortConfig]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSort = (key) => {
    setSortConfig(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const exportCSV = () => {
    const headers = ["Date", "Payee", "Description", "Account Code", "Cheque No", "Deposit", "Payment", "Balance"];
    const rows = filtered.map(tx => [tx.date, tx.payee, tx.details, tx.details.startsWith("EFC") ? tx.details : "", tx.chequeNo, tx.deposit || "", tx.payment || "", tx.balance]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "revenue_account_cashbook_2026.csv";
    a.click();
  };

  const cardStyle = { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px" };
  const thStyle = { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const tdStyle = { padding: "10px 12px", fontSize: 13, borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, whiteSpace: "nowrap" };
  const tabBtn = (active) => ({ background: active ? COLORS.gold : "transparent", color: active ? "#000" : COLORS.muted, border: `1px solid ${active ? COLORS.gold : COLORS.border}`, borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: COLORS.gold, fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Revenue Account Cashbook 2026</h2>
          <p style={{ color: COLORS.muted, fontSize: 12, margin: "4px 0 0" }}>Ekhaya Football Club | Jan – Mar 2026 | Opening Balance: MWK 19,571.81</p>
        </div>
        <button onClick={exportCSV} style={{ background: COLORS.gold, color: "#000", fontWeight: 600, fontSize: 12, padding: "8px 14px", borderRadius: 7, border: "none", cursor: "pointer" }}>Export CSV</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.success}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Total Funding (Deposits)</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.success, marginTop: 4 }}>MWK {TOTAL_DEPOSITS.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.danger}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Total Expenditure (Payments)</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.danger, marginTop: 4 }}>MWK {TOTAL_PAYMENTS.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.gold}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Net Balance</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gold, marginTop: 4 }}>MWK {INITIAL_CASHBOOK[INITIAL_CASHBOOK.length - 1]?.balance.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.goldLight}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Transactions</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginTop: 4 }}>{INITIAL_CASHBOOK.length}</div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div style={cardStyle}>
        <h3 style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Monthly Summary</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Month</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Deposits</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Payments</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Net</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map(m => {
                const d = new Date(m.month + "-01");
                const label = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
                return (
                  <tr key={m.month}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{label}</td>
                    <td style={{ ...tdStyle, textAlign: "right", color: COLORS.success, fontWeight: 700 }}>MWK {m.deposits.toLocaleString()}</td>
                    <td style={{ ...tdStyle, textAlign: "right", color: COLORS.danger, fontWeight: 700 }}>MWK {m.payments.toLocaleString()}</td>
                    <td style={{ ...tdStyle, textAlign: "right", color: m.deposits - m.payments >= 0 ? COLORS.gold : COLORS.danger, fontWeight: 700 }}>MWK {(m.deposits - m.payments).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: `2px solid ${COLORS.gold}44` }}>
                <td style={{ ...tdStyle, fontWeight: 700, color: COLORS.gold }}>Total</td>
                <td style={{ ...tdStyle, textAlign: "right", color: COLORS.success, fontWeight: 700 }}>MWK {TOTAL_DEPOSITS.toLocaleString()}</td>
                <td style={{ ...tdStyle, textAlign: "right", color: COLORS.danger, fontWeight: 700 }}>MWK {TOTAL_PAYMENTS.toLocaleString()}</td>
                <td style={{ ...tdStyle, textAlign: "right", color: COLORS.gold, fontWeight: 700 }}>MWK {(TOTAL_DEPOSITS - TOTAL_PAYMENTS).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Summary */}
      <div style={cardStyle}>
        <h3 style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Expenditure by Department</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {deptSummary.map(d => {
            const total = d.deposits + d.payments;
            const maxDept = Math.max(...deptSummary.map(x => x.deposits + x.payments));
            const pct = maxDept > 0 ? (total / maxDept * 100) : 0;
            return (
              <div key={d.dept} style={{ padding: "10px 14px", background: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>{d.dept}</div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  {d.deposits > 0 && <span style={{ fontSize: 12, color: COLORS.success, fontWeight: 600 }}>+MWK {d.deposits.toLocaleString()}</span>}
                  {d.payments > 0 && <span style={{ fontSize: 12, color: COLORS.danger, fontWeight: 600 }}>-MWK {d.payments.toLocaleString()}</span>}
                </div>
                <div style={{ height: 4, background: COLORS.border, borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: COLORS.gold, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={tabBtn(showSummary === "transactions")} onClick={() => setShowSummary("transactions")}>Transactions</button>
        <button style={tabBtn(showSummary === "categories")} onClick={() => setShowSummary("categories")}>Expense Categories</button>
      </div>

      {showSummary === "categories" && (
        <div style={cardStyle}>
          <h3 style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Expenditure by Category</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Deposits</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Payments</th>
                </tr>
              </thead>
              <tbody>
                {categorySummary.slice(0, 30).map(c => (
                  <tr key={c.category}>
                    <td style={tdStyle}>{c.category}</td>
                    <td style={{ ...tdStyle, textAlign: "right", color: c.deposits > 0 ? COLORS.success : COLORS.muted }}>{c.deposits > 0 ? `MWK ${c.deposits.toLocaleString()}` : "\u2014"}</td>
                    <td style={{ ...tdStyle, textAlign: "right", color: c.payments > 0 ? COLORS.danger : COLORS.muted }}>{c.payments > 0 ? `MWK ${c.payments.toLocaleString()}` : "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showSummary === "transactions" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input style={{ ...inputStyle, width: 220 }} placeholder="Search payee, description, cheque..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
            <select style={{ ...inputStyle, width: 130 }} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">All Types</option>
              <option value="deposits">Deposits Only</option>
              <option value="payments">Payments Only</option>
            </select>
            <select style={{ ...inputStyle, width: 150 }} value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select style={{ ...inputStyle, width: 140 }} value={monthFilter} onChange={e => { setMonthFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">All Months</option>
              {months.map(m => {
                const d = new Date(m + "-01");
                return <option key={m} value={m}>{d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</option>;
              })}
            </select>
          </div>

          {/* Transactions Table */}
          <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, margin: 0 }}>Transactions ({filtered.length})</h3>
              <span style={{ fontSize: 11, color: COLORS.muted }}>Click headers to sort</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      { key: "date", label: "Date" },
                      { key: "payee", label: "Payee / Source" },
                      { key: "details", label: "Details / Account Code" },
                      { key: "chequeNo", label: "Cheque No" },
                      { key: "deposit", label: "Deposit" },
                      { key: "payment", label: "Payment" },
                      { key: "balance", label: "Balance" },
                    ].map(col => (
                      <th key={col.key} style={{ ...thStyle, textAlign: col.key === "deposit" || col.key === "payment" || col.key === "balance" ? "right" : "left" }} onClick={() => handleSort(col.key)}>
                        {col.label} {sortConfig.key === col.key ? (sortConfig.dir === "asc" ? "\u25B2" : "\u25BC") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((tx, i) => (
                    <tr key={tx.id} style={{ background: i % 2 === 0 ? "transparent" : COLORS.surface }}>
                      <td style={tdStyle}>{tx.date}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }}>{tx.payee}</td>
                      <td style={{ ...tdStyle, whiteSpace: "normal", maxWidth: 300, fontSize: 12 }}>
                        {tx.parsed ? (
                          <span>
                            <span style={{ color: COLORS.gold, fontFamily: "monospace" }}>{tx.details.split(" ")[0]}</span>{" "}
                            <span style={{ color: COLORS.muted }}>{tx.parsed.expense}</span>
                          </span>
                        ) : tx.details}
                      </td>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{tx.chequeNo}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: tx.deposit > 0 ? COLORS.success : COLORS.muted }}>
                        {tx.deposit > 0 ? `MWK ${tx.deposit.toLocaleString()}` : "\u2014"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: tx.payment > 0 ? COLORS.danger : COLORS.muted }}>
                        {tx.payment > 0 ? `MWK ${tx.payment.toLocaleString()}` : "\u2014"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: tx.balance >= 0 ? COLORS.text : COLORS.danger }}>
                        MWK {tx.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.muted }}>Page {currentPage} of {totalPages || 1}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}
                  style={{ ...navBtnStyle, opacity: currentPage <= 1 ? 0.3 : 1, fontSize: 12, padding: "6px 12px" }}>Prev</button>
                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}
                  style={{ ...navBtnStyle, opacity: currentPage >= totalPages ? 0.3 : 1, fontSize: 12, padding: "6px 12px" }}>Next</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================
   MAIN APP
=============================================================== */

export default function EkhayaPerformanceHub() {
  const [tab, setTab] = useState("dashboard");
  const [players, setPlayers] = useLocalStorage("ekhaya-players", INITIAL_PLAYERS);
  const [injuries, setInjuries] = useLocalStorage("ekhaya-injuries", INITIAL_INJURIES);
  const [matches, setMatches] = useLocalStorage("ekhaya-matches", INITIAL_MATCHES);
  const [sessions, setSessions] = useLocalStorage("ekhaya-sessions", INITIAL_SESSIONS);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);

  const activeInjuries = injuries.filter(i => i.status === "active");
  const available = players.filter(p => p.status === "available").length;
  const avgFitness = Math.round(players.reduce((s, p) => s + p.fitness, 0) / players.length);
  const nextMatch = { opponent: "Karonga United", date: "2026-08-30", competition: "Super League", venue: "away" };

  return (
    <div style={{
      display: "flex", height: "100%", minHeight: 640, background: COLORS.bg,
      color: COLORS.text, fontFamily: "'Inter', sans-serif", borderRadius: 12, overflow: "hidden",
      border: `1px solid ${COLORS.border}`,
    }}>
      <style>{FONT_IMPORT}{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        button { cursor: pointer; font-family: 'Inter', sans-serif; }
        table { border-collapse: collapse; width: 100%; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: 210, flexShrink: 0, background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column",
        padding: "20px 12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px 8px", borderBottom: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
          <img
            src="https://owinna.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkFtIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4d6f2d26151247cb834c9b4fb0e8090980d6f0ad/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2QzNKbGMybDZaVWtpRERNd01IZ3pNREFHT3daVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--03c7c270d26484af6a246d56d605625277ecb7bc/ekhaya.jpg"
            alt="Ekhaya FC"
            style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover" }}
          />
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em", color: COLORS.gold }}>EKHAYA FC</div>
            <div style={{ fontSize: 10, color: COLORS.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>PERFORMANCE HUB</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const activeItem = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 11px",
                  borderRadius: 7, border: "none", textAlign: "left",
                  background: activeItem ? COLORS.surface2 : "transparent",
                  color: activeItem ? COLORS.gold : COLORS.muted,
                  fontSize: 13, fontWeight: activeItem ? 600 : 500,
                  borderLeft: activeItem ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  transition: "background .15s, color .15s",
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 12 }}>
          <div style={{ fontSize: 10, color: COLORS.faint, fontFamily: "'JetBrains Mono', monospace" }}>2026/27 SEASON</div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 3 }}>Malawi Super League</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        {tab === "dashboard" && (
          <Dashboard players={players} injuries={activeInjuries} matches={matches}
            available={available} avgFitness={avgFitness} nextMatch={nextMatch} playerMap={playerMap} />
        )}
        {tab === "medical" && (
          <Medical players={players} injuries={injuries} setInjuries={setInjuries} playerMap={playerMap} />
        )}
        {tab === "logmatch" && (
          <LogMatch players={players} setMatches={setMatches} onLogged={() => setTab("reports")} />
        )}
        {tab === "reports" && (
          <MatchReports matches={matches} selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} />
        )}
        {tab === "analysis" && (
          <Analysis players={players} matches={matches} />
        )}
        {tab === "revenue" && (
          <RevenueCashbook />
        )}
        {tab === "players" && (
          <Players players={players} injuries={injuries} setPlayers={setPlayers} />
        )}
        {tab === "sessions" && (
          <Sessions sessions={sessions} setSessions={setSessions} />
        )}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}

/* ================================================================
   DASHBOARD
================================================================ */

function Dashboard({ players, injuries, matches, available, avgFitness, nextMatch, playerMap }) {
  const lastMatch = matches[0];
  const form = matches.slice(0, 5).map(m => m.scoreFor > m.scoreAgainst ? "W" : m.scoreFor === m.scoreAgainst ? "D" : "L");
  const formColor = { W: COLORS.gold, D: COLORS.goldLight, L: COLORS.danger };
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];

  return (
    <div>
      <Header eyebrow="Overview" title="Squad Dashboard" subtitle={`Matchday snapshot · ${available}/${players.length} players available`} />

      {/* scoreboard strip */}
      <Card style={{ marginBottom: 18, background: `linear-gradient(160deg, ${COLORS.surface}, ${COLORS.surface2})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 34 }}>
            <ScoreDigit label="Available" value={available} />
            <ScoreDigit label="Doubtful" value={players.filter(p => p.status === "doubtful").length} accent={COLORS.goldLight} />
            <ScoreDigit label="Injured" value={players.filter(p => p.status === "injured").length} accent={COLORS.danger} />
            <ScoreDigit label="Avg Fitness" value={`${avgFitness}%`} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {form.map((r, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                color: COLORS.bg, background: formColor[r],
              }}>{r}</div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card eyebrow="Next Fixture" title={`vs ${nextMatch.opponent}`} right={<Pill>{nextMatch.venue === "home" ? "HOME" : "AWAY"}</Pill>}>
          <div style={{ display: "flex", gap: 22, color: COLORS.muted, fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> {nextMatch.date}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {nextMatch.competition}</span>
          </div>
          {lastMatch && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.faint }}>
              Last result: <span style={{ color: COLORS.text }}>Ekhaya {lastMatch.scoreFor} – {lastMatch.scoreAgainst} {lastMatch.opponent}</span>
            </div>
          )}
        </Card>

        <Card eyebrow="Top Scorer" title={topScorer.name} right={<Badge number={topScorer.number} />}>
          <div style={{ display: "flex", gap: 20 }}>
            <div><div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, color: COLORS.gold }}>{topScorer.goals}</div><div style={{ fontSize: 10, color: COLORS.faint }}>GOALS</div></div>
            <div><div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22 }}>{topScorer.assists}</div><div style={{ fontSize: 10, color: COLORS.faint }}>ASSISTS</div></div>
            <div><div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22 }}>{topScorer.apps}</div><div style={{ fontSize: 10, color: COLORS.faint }}>APPS</div></div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card eyebrow="Medical" title="Active Injuries" right={<AlertTriangle size={16} color={COLORS.goldLight} />}>
          {injuries.length === 0 ? (
            <EmptyNote text="No active injuries — full squad fit." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {injuries.map(inj => {
                const p = playerMap[inj.playerId];
                return (
                  <div key={inj.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <Badge number={p.number} size={28} color={COLORS.danger} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.faint }}>{inj.type} · back {inj.expectedReturn}</div>
                    </div>
                    <Pill color={inj.severity === "moderate" ? COLORS.goldLight : COLORS.danger}>{inj.severity}</Pill>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card eyebrow="Recent Form" title="Last 5 Matches">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {matches.slice(0, 5).map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: COLORS.muted }}>
                <span>{m.date} · {m.opponent}</span>
                <span style={{ color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{m.scoreFor}-{m.scoreAgainst}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ================================================================
   MEDICAL
================================================================ */

function Medical({ players, injuries, setInjuries, playerMap }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ playerId: players[0].id, type: "", grade: "Grade 1", occurred: "", expectedReturn: "", severity: "minor", notes: "" });

  const active = injuries.filter(i => i.status === "active");
  const resolved = injuries.filter(i => i.status === "recovered");

  function submit(e) {
    e.preventDefault();
    if (!form.type || !form.occurred) return;
    setInjuries(list => [{ id: Date.now(), ...form, playerId: Number(form.playerId), status: "active" }, ...list]);
    setShowForm(false);
    setForm({ playerId: players[0].id, type: "", grade: "Grade 1", occurred: "", expectedReturn: "", severity: "minor", notes: "" });
  }

  function markRecovered(id) {
    setInjuries(list => list.map(i => i.id === id ? { ...i, status: "recovered" } : i));
  }

  return (
    <div>
      <Header eyebrow="Medical" title="Injury & Health Tracker" subtitle={`${active.length} active case${active.length === 1 ? "" : "s"} on the treatment table`}
        action={<ActionButton onClick={() => setShowForm(s => !s)} label={showForm ? "Close" : "Log Injury"} icon={showForm ? X : Plus} />} />

      {showForm && (
        <Card style={{ marginBottom: 18 }} title="New Injury Record">
          <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Field label="Player">
              <select style={inputStyle} value={form.playerId} onChange={e => setForm({ ...form, playerId: e.target.value })}>
                {players.map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
              </select>
            </Field>
            <Field label="Injury type">
              <input style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="e.g. Hamstring strain" />
            </Field>
            <Field label="Grade / note">
              <input style={inputStyle} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            </Field>
            <Field label="Date occurred">
              <input type="date" style={inputStyle} value={form.occurred} onChange={e => setForm({ ...form, occurred: e.target.value })} />
            </Field>
            <Field label="Expected return">
              <input type="date" style={inputStyle} value={form.expectedReturn} onChange={e => setForm({ ...form, expectedReturn: e.target.value })} />
            </Field>
            <Field label="Severity">
              <select style={inputStyle} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes">
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <ActionButton type="submit" label="Save Record" icon={Plus} />
            </div>
          </form>
        </Card>
      )}

      <Card title="Active Cases" eyebrow="Treatment table" style={{ marginBottom: 18 }}>
        {active.length === 0 ? <EmptyNote text="No active injuries." /> : (
          <table>
            <thead>
              <tr style={{ textAlign: "left", fontSize: 11, color: COLORS.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={th}>Player</th><th style={th}>Injury</th><th style={th}>Occurred</th><th style={th}>Expected Return</th><th style={th}>Severity</th><th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {active.map(inj => {
                const p = playerMap[inj.playerId];
                return (
                  <tr key={inj.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Badge number={p.number} size={26} color={COLORS.danger} />{p.name}</div></td>
                    <td style={td}>{inj.type} <span style={{ color: COLORS.faint }}>({inj.grade})</span></td>
                    <td style={td}>{inj.occurred}</td>
                    <td style={td}>{inj.expectedReturn}</td>
                    <td style={td}><Pill color={inj.severity === "severe" ? COLORS.danger : inj.severity === "moderate" ? COLORS.goldLight : COLORS.gold}>{inj.severity}</Pill></td>
                    <td style={td}><button onClick={() => markRecovered(inj.id)} style={linkBtn}>Mark recovered</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Squad Fitness" eyebrow="Load status">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {players.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 130, fontSize: 12.5, display: "flex", alignItems: "center", gap: 8 }}>
                <Badge number={p.number} size={24} color={STATUS_META[p.status].color} />{p.name}
              </div>
              <div style={{ flex: 1, height: 6, background: COLORS.surface2, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${p.fitness}%`, height: "100%", background: STATUS_META[p.status].color }} />
              </div>
              <div style={{ width: 38, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{p.fitness}%</div>
              <div style={{ width: 90 }}><StatusDot status={p.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================
   LOG MATCH
================================================================ */

function LogMatch({ players, setMatches, onLogged }) {
  const [form, setForm] = useState({
    opponent: "", date: "", competition: "Super League", venue: "home",
    scoreFor: 0, scoreAgainst: 0, possession: 50, shots: 0, shotsOnTarget: 0, notes: "",
  });
  const [saved, setSaved] = useState(false);

  function update(field, value) { setForm({ ...form, [field]: value }); }

  function submit(e) {
    e.preventDefault();
    if (!form.opponent || !form.date) return;
    setMatches(list => [{ id: Date.now(), ...form, scoreFor: Number(form.scoreFor), scoreAgainst: Number(form.scoreAgainst), possession: Number(form.possession), shots: Number(form.shots), shotsOnTarget: Number(form.shotsOnTarget) }, ...list]);
    setSaved(true);
    setTimeout(() => { setSaved(false); onLogged(); }, 700);
  }

  return (
    <div>
      <Header eyebrow="Matchday" title="Log Match" subtitle="Record the result and key match data" />
      <Card style={{ maxWidth: 720 }}>
        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Opponent">
            <input style={inputStyle} value={form.opponent} onChange={e => update("opponent", e.target.value)} placeholder="e.g. Karonga United" />
          </Field>
          <Field label="Date">
            <input type="date" style={inputStyle} value={form.date} onChange={e => update("date", e.target.value)} />
          </Field>
          <Field label="Competition">
            <select style={inputStyle} value={form.competition} onChange={e => update("competition", e.target.value)}>
              <option>Super League</option><option>Cup R1</option><option>Cup R2</option><option>Friendly</option>
            </select>
          </Field>
          <Field label="Venue">
            <select style={inputStyle} value={form.venue} onChange={e => update("venue", e.target.value)}>
              <option value="home">Home</option><option value="away">Away</option>
            </select>
          </Field>
          <Field label="Ekhaya FC score">
            <input type="number" min="0" style={inputStyle} value={form.scoreFor} onChange={e => update("scoreFor", e.target.value)} />
          </Field>
          <Field label="Opponent score">
            <input type="number" min="0" style={inputStyle} value={form.scoreAgainst} onChange={e => update("scoreAgainst", e.target.value)} />
          </Field>
          <Field label="Possession %">
            <input type="number" min="0" max="100" style={inputStyle} value={form.possession} onChange={e => update("possession", e.target.value)} />
          </Field>
          <Field label="Shots (on target)">
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" min="0" style={inputStyle} value={form.shots} onChange={e => update("shots", e.target.value)} placeholder="Total" />
              <input type="number" min="0" style={inputStyle} value={form.shotsOnTarget} onChange={e => update("shotsOnTarget", e.target.value)} placeholder="On target" />
            </div>
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Match notes">
              <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Key moments, standout performers, tactical notes..." />
            </Field>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <ActionButton type="submit" label={saved ? "Saved ✓" : "Save Match"} icon={saved ? undefined : Plus} />
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ================================================================
   MATCH REPORTS
================================================================ */

function MatchReports({ matches, selectedMatch, setSelectedMatch }) {
  const detail = matches.find(m => m.id === selectedMatch) || matches[0];

  return (
    <div>
      <Header eyebrow="Reports" title="Match Reports" subtitle={`${matches.length} matches logged this season`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18 }}>
        <Card title="Fixture List" eyebrow="Select a match" style={{ padding: 8, maxHeight: 560, overflowY: "auto" }}>
          {matches.map(m => {
            const res = m.scoreFor > m.scoreAgainst ? "W" : m.scoreFor === m.scoreAgainst ? "D" : "L";
            const active = detail?.id === m.id;
            return (
              <button key={m.id} onClick={() => setSelectedMatch(m.id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "10px 10px", borderRadius: 7, border: "none",
                background: active ? COLORS.surface2 : "transparent", color: COLORS.text,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: COLORS.bg,
                  background: res === "W" ? COLORS.gold : res === "D" ? COLORS.goldLight : COLORS.danger,
                }}>{res}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.opponent}</div>
                  <div style={{ fontSize: 11, color: COLORS.faint }}>{m.date} · {m.competition}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{m.scoreFor}-{m.scoreAgainst}</div>
                <ChevronRight size={14} color={COLORS.faint} />
              </button>
            );
          })}
        </Card>

        {detail && (
          <Card eyebrow={`${detail.competition} · ${detail.venue === "home" ? "Home" : "Away"}`} title={`Ekhaya FC ${detail.scoreFor} – ${detail.scoreAgainst} ${detail.opponent}`}>
            <div style={{ fontSize: 12, color: COLORS.faint, marginBottom: 16 }}>{detail.date}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
              <StatBlock label="Possession" value={`${detail.possession}%`} />
              <StatBlock label="Shots" value={detail.shots} />
              <StatBlock label="On Target" value={detail.shotsOnTarget} />
            </div>
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 11, color: COLORS.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Match Notes</div>
              <div style={{ fontSize: 13.5, color: COLORS.muted, lineHeight: 1.6 }}>{detail.notes || "No notes recorded."}</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, color: COLORS.gold }}>{value}</div>
      <div style={{ fontSize: 10, color: COLORS.faint, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

/* ================================================================
   ANALYSIS
================================================================ */

function Analysis({ players, matches }) {
  const goalData = [...players].sort((a, b) => b.goals - a.goals).slice(0, 8).map(p => ({ name: p.name.split(" ")[1] || p.name, goals: p.goals, assists: p.assists }));
  const minutesData = [...players].sort((a, b) => b.minutes - a.minutes).slice(0, 8).map(p => ({ name: p.name.split(" ")[1] || p.name, minutes: p.minutes }));
  const radarData = [
    { metric: "Possession", value: Math.round(matches.reduce((s, m) => s + m.possession, 0) / matches.length) },
    { metric: "Shots/Match", value: Math.round((matches.reduce((s, m) => s + m.shots, 0) / matches.length) * 5) },
    { metric: "Accuracy", value: Math.round((matches.reduce((s, m) => s + m.shotsOnTarget, 0) / Math.max(1, matches.reduce((s, m) => s + m.shots, 0))) * 100) },
    { metric: "Fitness", value: Math.round(players.reduce((s, p) => s + p.fitness, 0) / players.length) },
    { metric: "Discipline", value: 100 - players.reduce((s, p) => s + p.yellow * 4 + p.red * 12, 0) },
  ];

  return (
    <div>
      <Header eyebrow="Analysis" title="Performance Analytics" subtitle="Squad and match trends across the season" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card title="Goal Contributions" eyebrow="Top 8 players">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={goalData}>
              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: COLORS.text }} />
              <Bar dataKey="goals" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              <Bar dataKey="assists" fill={COLORS.goldDim} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Fitness Trend" eyebrow="Weekly squad average">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={FITNESS_TREND}>
              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="week" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: COLORS.text }} />
              <Line type="monotone" dataKey="avg" stroke={COLORS.gold} strokeWidth={2.5} dot={{ fill: COLORS.gold, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card title="Minutes Played" eyebrow="Top 8 players">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={minutesData} layout="vertical">
              <CartesianGrid stroke={COLORS.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: COLORS.text }} />
              <Bar dataKey="minutes" fill={COLORS.goldLight} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Team Profile" eyebrow="Season averages">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} outerRadius={80}>
              <PolarGrid stroke={COLORS.border} />
              <PolarAngleAxis dataKey="metric" tick={{ fill: COLORS.faint, fontSize: 11 }} />
              <Radar dataKey="value" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.28} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ================================================================
   PLAYERS
================================================================ */

function Players({ players, injuries }) {
  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const positions = ["all", ...Array.from(new Set(players.map(p => p.position)))];

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) &&
    (posFilter === "all" || p.position === posFilter)
  );

  return (
    <div>
      <Header eyebrow="Squad" title="Players" subtitle={`${players.length} registered players`} />

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "8px 12px", flex: 1, maxWidth: 280 }}>
          <Search size={14} color={COLORS.faint} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search players..." style={{ background: "transparent", border: "none", outline: "none", color: COLORS.text, fontSize: 13, width: "100%" }} />
        </div>
        <select value={posFilter} onChange={e => setPosFilter(e.target.value)} style={inputStyle}>
          {positions.map(pos => <option key={pos} value={pos}>{pos === "all" ? "All positions" : pos}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
        {filtered.map(p => (
          <Card key={p.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Badge number={p.number} size={40} color={STATUS_META[p.status].color} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: COLORS.faint }}>{p.position} · Age {p.age}</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}><StatusDot status={p.status} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 12, textAlign: "center" }}>
              <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: COLORS.text }}>{p.goals}</div><div style={{ color: COLORS.faint, fontSize: 10 }}>G</div></div>
              <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: COLORS.text }}>{p.assists}</div><div style={{ color: COLORS.faint, fontSize: 10 }}>A</div></div>
              <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: COLORS.text }}>{p.apps}</div><div style={{ color: COLORS.faint, fontSize: 10 }}>APP</div></div>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.faint }}>
              <span>{p.minutes} mins</span>
              <span>{p.yellow > 0 && <Pill color={COLORS.goldLight}>{p.yellow} YC</Pill>} {p.red > 0 && <Pill color={COLORS.danger}>{p.red} RC</Pill>}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SESSIONS
================================================================ */

const INTENSITY_COLOR = { low: COLORS.gold, medium: COLORS.goldLight, high: COLORS.danger };

function Sessions({ sessions, setSessions }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", type: "Training", focus: "", duration: 60, intensity: "medium", attendance: 20, squad: 24, notes: "" });

  function submit(e) {
    e.preventDefault();
    if (!form.date || !form.focus) return;
    setSessions(list => [{ id: Date.now(), ...form, duration: Number(form.duration), attendance: Number(form.attendance), squad: Number(form.squad) }, ...list]);
    setShowForm(false);
    setForm({ date: "", type: "Training", focus: "", duration: 60, intensity: "medium", attendance: 20, squad: 24, notes: "" });
  }

  return (
    <div>
      <Header eyebrow="Training" title="Sessions" subtitle={`${sessions.length} sessions logged`}
        action={<ActionButton onClick={() => setShowForm(s => !s)} label={showForm ? "Close" : "Log Session"} icon={showForm ? X : Plus} />} />

      {showForm && (
        <Card style={{ marginBottom: 18 }} title="New Session">
          <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Field label="Date"><input type="date" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Type">
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Training</option><option>Recovery</option><option>Tactical</option><option>Gym</option>
              </select>
            </Field>
            <Field label="Focus"><input style={inputStyle} value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })} placeholder="e.g. Set pieces" /></Field>
            <Field label="Duration (mins)"><input type="number" style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></Field>
            <Field label="Intensity">
              <select style={inputStyle} value={form.intensity} onChange={e => setForm({ ...form, intensity: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </Field>
            <Field label="Attendance"><input type="number" style={inputStyle} value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}><ActionButton type="submit" label="Save Session" icon={Plus} /></div>
          </form>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map(s => (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 4, height: 34, borderRadius: 3, background: INTENSITY_COLOR[s.intensity] }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.type} · {s.focus}</div>
                  <div style={{ fontSize: 11, color: COLORS.faint }}>{s.date} · {s.duration} mins</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Pill color={INTENSITY_COLOR[s.intensity]}>{s.intensity} intensity</Pill>
                <div style={{ fontSize: 12, color: COLORS.muted, display: "flex", alignItems: "center", gap: 6 }}>
                  <Activity size={13} /> {s.attendance}/{s.squad}
                </div>
              </div>
            </div>
            {s.notes && <div style={{ marginTop: 10, fontSize: 12.5, color: COLORS.muted, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>{s.notes}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SETTINGS
================================================================ */

function SettingsPanel() {
  const [club, setClub] = useState({ name: "Ekhaya FC", season: "2026/27", ground: "Ekhaya Grounds, Lilongwe", formation: "4-3-3" });
  const [toggles, setToggles] = useState({ injuryAlerts: true, matchReminders: true, weeklyReport: false });

  function resetAllData() {
    if (window.confirm("Reset ALL data? This will clear matches, injuries, sessions, and restore the default squad.")) {
      localStorage.removeItem("ekhaya-players");
      localStorage.removeItem("ekhaya-injuries");
      localStorage.removeItem("ekhaya-matches");
      localStorage.removeItem("ekhaya-sessions");
      window.location.reload();
    }
  }

  return (
    <div>
      <Header eyebrow="Configuration" title="Settings" subtitle="Club details and notification preferences" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card title="Club Profile" eyebrow="Identity">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Club name"><input style={inputStyle} value={club.name} onChange={e => setClub({ ...club, name: e.target.value })} /></Field>
            <Field label="Season"><input style={inputStyle} value={club.season} onChange={e => setClub({ ...club, season: e.target.value })} /></Field>
            <Field label="Home ground"><input style={inputStyle} value={club.ground} onChange={e => setClub({ ...club, ground: e.target.value })} /></Field>
            <Field label="Default formation">
              <select style={inputStyle} value={club.formation} onChange={e => setClub({ ...club, formation: e.target.value })}>
                <option>4-3-3</option><option>4-2-3-1</option><option>4-4-2</option><option>3-5-2</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card title="Notifications" eyebrow="Alerts">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Toggle label="Injury status alerts" desc="Notify staff when a player's status changes" value={toggles.injuryAlerts} onChange={v => setToggles({ ...toggles, injuryAlerts: v })} />
            <Toggle label="Match day reminders" desc="Reminder 24 hours before each fixture" value={toggles.matchReminders} onChange={v => setToggles({ ...toggles, matchReminders: v })} />
            <Toggle label="Weekly performance report" desc="Auto-summary sent every Monday" value={toggles.weeklyReport} onChange={v => setToggles({ ...toggles, weeklyReport: v })} />
          </div>
        </Card>
      </div>

      <Card title="Data Management" eyebrow="Danger zone" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Reset to defaults</div>
            <div style={{ fontSize: 12, color: COLORS.faint }}>Clears all localStorage data and restores seed squad, injuries, matches, and sessions.</div>
          </div>
          <ActionButton onClick={resetAllData} label="Reset All Data" icon={AlertTriangle} style={{ background: COLORS.danger, color: COLORS.white }} />
        </div>
      </Card>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: COLORS.faint, marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 40, height: 22, borderRadius: 20, border: "none", position: "relative", flexShrink: 0,
        background: value ? COLORS.gold : COLORS.surface2,
      }}>
        <span style={{
          position: "absolute", top: 2, left: value ? 20 : 2, width: 18, height: 18, borderRadius: "50%",
          background: value ? COLORS.bg : COLORS.faint, transition: "left .15s",
        }} />
      </button>
    </div>
  );
}

/* ================================================================
   shared bits
================================================================ */

function Header({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", color: COLORS.gold, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{eyebrow}</div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function ActionButton({ onClick, label, icon: Icon, type = "button", style }) {
  return (
    <button type={type} onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8, background: COLORS.gold, color: COLORS.bg,
      border: "none", borderRadius: 7, padding: "10px 16px", fontSize: 13, fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      ...style,
    }}>
      {Icon && <Icon size={15} />} {label}
    </button>
  );
}

function EmptyNote({ text }) {
  return <div style={{ fontSize: 13, color: COLORS.faint, padding: "10px 0" }}>{text}</div>;
}

const th = { padding: "8px 10px" };
const td = { padding: "10px 10px", fontSize: 13 };
const linkBtn = { background: "none", border: "none", color: COLORS.gold, fontSize: 12, fontWeight: 600, padding: 0 };

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

/* ---------------- Cashbook Revenue Account Codes ---------------- */
const REVENUE_ACCOUNTS = {
  "EFC101-5001": "Sponsorship",
  "EFC101-5002": "Gate Collections",
  "EFC101-5003": "Jersey & Other Merchandise",
  "EFC101-5004": "Subventions",
  "EFC101-5005": "Donations",
  "EFC101-5006": "TV Rights",
  "EFC101-5007": "Other Income",
};

const INITIAL_CASHBOOK = [
  { id: 1, date: "2025-01-01", description: "Opening Balance", details: "Cashbook Revenue 2025", accountCode: "", amount: 92200, type: "credit" },
  { id: 2, date: "2025-01-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 191000, type: "debit" },
  { id: 3, date: "2025-02-11", description: "Cheque Deposit", details: "NBM Chq:002225", accountCode: "EFC101-5002", amount: 1952080, type: "credit" },
  { id: 4, date: "2025-02-21", description: "Online Banking Transfer", details: "Transfer for Feb 2025 Week 3 Budget", accountCode: "", amount: 50000, type: "debit" },
  { id: 5, date: "2025-02-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 191000, type: "debit" },
  { id: 6, date: "2025-02-26", description: "Online Banking Transfer", details: "Ekhaya Football Club Share of Costs", accountCode: "EFC101-5005", amount: 7142857, type: "credit" },
  { id: 7, date: "2025-02-26", description: "Online Banking Transfer", details: "Ekhaya Hardelec Shared cost for Ekh", accountCode: "EFC101-5005", amount: 7142857, type: "credit" },
  { id: 8, date: "2025-02-26", description: "Online Banking Transfer", details: "Ekhaya football club share", accountCode: "EFC101-5005", amount: 7142857, type: "credit" },
  { id: 9, date: "2025-02-26", description: "Cash Deposit", details: "KAVINA", accountCode: "EFC101-5005", amount: 3000000, type: "credit" },
  { id: 10, date: "2025-02-26", description: "Online Banking Transfer", details: "SPONSORSHIP FOR FOOTBALL", accountCode: "EFC101-5001", amount: 7500000, type: "credit" },
  { id: 11, date: "2025-02-26", description: "Online Banking Transfer", details: "Salary Funding", accountCode: "", amount: 0, type: "credit" },
  { id: 12, date: "2025-02-27", description: "Online Banking Transfer", details: "Northgate contribution", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 13, date: "2025-03-14", description: "Online Banking Transfer", details: "Revenue to Ekhaya Ops", accountCode: "", amount: 0, type: "debit" },
  { id: 14, date: "2025-03-19", description: "Transfer In", details: "CHIMWEMWE CHIGOM", accountCode: "EFC101-5003", amount: 147200019, type: "credit" },
  { id: 15, date: "2025-03-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 191000, type: "debit" },
  { id: 16, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5005", accountCode: "EFC101-5005", amount: 12600, type: "credit" },
  { id: 17, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5005", accountCode: "EFC101-5005", amount: 1200000, type: "credit" },
  { id: 18, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 160000, type: "credit" },
  { id: 19, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5005", accountCode: "EFC101-5005", amount: 1334900, type: "credit" },
  { id: 20, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5001", accountCode: "EFC101-5001", amount: 15000000, type: "credit" },
  { id: 21, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5005", accountCode: "EFC101-5005", amount: 1300000, type: "credit" },
  { id: 22, date: "2025-03-26", description: "Online Banking Transfer", details: "EFC101-5005", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 23, date: "2025-03-26", description: "Online Banking Transfer", details: "Sponsorship Ekhaya FC Hardelec", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 24, date: "2025-04-04", description: "Online Banking Transfer", details: "Revenue to Ekhaya Ops", accountCode: "", amount: 0, type: "debit" },
  { id: 25, date: "2025-04-08", description: "Online Banking Transfer", details: "Revenue to Ops Transfer", accountCode: "", amount: 0, type: "debit" },
  { id: 26, date: "2025-04-14", description: "Online Banking Transfer", details: "Sponsorship Ekhaya FC Zomba", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 27, date: "2025-04-15", description: "Online Banking Transfer", details: "Sponsorship Ekhaya FC Northgate", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 28, date: "2025-04-15", description: "Cash Deposit", details: "GATE COLLECTION EKHAYA - GREGORY MANDOWA", accountCode: "EFC101-5002", amount: 29100, type: "credit" },
  { id: 29, date: "2025-04-15", description: "Online Banking Transfer", details: "EK10SH to Ekhaya FC contribution", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 30, date: "2025-04-16", description: "Online Banking Transfer", details: "Ekhaya Football Club Sponsorship", accountCode: "EFC101-5001", amount: 7500000, type: "credit" },
  { id: 31, date: "2025-04-19", description: "Online Banking Transfer", details: "EFC Salaries Account", accountCode: "", amount: 0, type: "debit" },
  { id: 32, date: "2025-04-22", description: "Cash Deposit", details: "ONLY BANDA", accountCode: "EFC101-5002", amount: 258500, type: "credit" },
  { id: 33, date: "2025-04-22", description: "Transfer In", details: "MBENDERA GEORGE", accountCode: "EFC101-5003", amount: 147200019, type: "credit" },
  { id: 34, date: "2025-04-24", description: "Online Banking Transfer", details: "EKHAYA GOLD JERSEY", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 35, date: "2025-04-24", description: "Online Banking Transfer", details: "EK10SH to Ekhaya FC contribution for", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 36, date: "2025-04-25", description: "Mobile Banking Transfer", details: "From: JOHN JAMES MAKONDETSA", accountCode: "EFC101-5003", amount: 312000, type: "credit" },
  { id: 37, date: "2025-04-25", description: "Online Banking Transfer", details: "Ekhaya FC Sponsorship", accountCode: "EFC101-5005", amount: 1000000, type: "credit" },
  { id: 38, date: "2025-04-28", description: "Cash Deposit", details: "BLESSINGS NGWEMBELE", accountCode: "EFC101-5003", amount: 11700000, type: "credit" },
  { id: 39, date: "2025-04-28", description: "Transfer In", details: "KAMWENDO MZANGA", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 40, date: "2025-04-28", description: "Cash Deposit", details: "BLESSINGS GWEMBELE", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 41, date: "2025-04-29", description: "Transfer In", details: "PHIRI CHIKUMBUTS", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 42, date: "2025-04-30", description: "Online Banking Transfer", details: "Luntha Payment", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 43, date: "2025-05-02", description: "Mobile Banking Transfer", details: "From: CRISPIN RODNY MTIKE", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 44, date: "2025-05-02", description: "Transfer In", details: "GRAHAM CHIPANDE", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 45, date: "2025-05-02", description: "Transfer In", details: "MTHUNZI WHAYO", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 46, date: "2025-05-02", description: "Online Banking Transfer", details: "Revenue to Ops Transfer", accountCode: "", amount: 0, type: "debit" },
  { id: 47, date: "2025-05-02", description: "Mobile Banking Transfer", details: "From: ESTHER COROA", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 48, date: "2025-05-02", description: "Cash Deposit", details: "BLESSINGS GWEMBELE", accountCode: "EFC101-5003", amount: 1300000, type: "credit" },
  { id: 49, date: "2025-05-02", description: "Transfer In", details: "PATRICIA JIMU", accountCode: "EFC101-5003", amount: 180000, type: "credit" },
  { id: 50, date: "2025-05-02", description: "EFT Incoming", details: "NSEULA CHARLES YAMIKI", accountCode: "EFC101-5003", amount: 8556000, type: "credit" },
  { id: 51, date: "2025-05-02", description: "Mobile Banking Transfer", details: "From: FOSTINO MAELE", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 52, date: "2025-05-03", description: "Mobile Banking Transfer", details: "From: MICHAEL BRIGHT SOMANJEE", accountCode: "EFC101-5003", amount: 900000, type: "credit" },
  { id: 53, date: "2025-05-03", description: "Mobile Banking Transfer", details: "From: MICHAEL BRIGHT SOMANJEE", accountCode: "EFC101-5003", amount: 300000, type: "credit" },
  { id: 54, date: "2025-05-03", description: "Mobile Banking Transfer", details: "From: KANKONDO JOHN", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 55, date: "2025-05-05", description: "Mobile Banking Transfer", details: "From: WILLIAM MPINGANJIRA", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 56, date: "2025-05-05", description: "Cash Deposit", details: "BLESSINGS GWEMBELE", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 57, date: "2025-05-06", description: "Transfer In", details: "HAU KLEMA CHISOM", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 58, date: "2025-05-06", description: "Cash Deposit", details: "BLESSINGS", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 59, date: "2025-05-06", description: "Mobile Banking Transfer", details: "From: CHIPUNGU ALEX KENNIE ALLAN", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 60, date: "2025-05-08", description: "Mobile Banking Transfer", details: "From: EDGAR LEWIS CHILUMPHA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 61, date: "2025-05-08", description: "Mobile Banking Transfer", details: "From: MATHEWS MTIMAUKANENA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 62, date: "2025-05-08", description: "Online Banking Transfer", details: "EK10SH to Ekhaya FC contribution for", accountCode: "EFC101-5005", amount: 1500000, type: "credit" },
  { id: 63, date: "2025-05-09", description: "Mobile Banking Transfer", details: "From: MADALO KALEKENI PHIRI", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 64, date: "2025-05-09", description: "Online Banking Transfer", details: "EFC101-5001", accountCode: "EFC101-5001", amount: 120000, type: "credit" },
  { id: 65, date: "2025-05-09", description: "Online Banking Transfer", details: "EFC101-5001", accountCode: "EFC101-5001", amount: 600000, type: "credit" },
  { id: 66, date: "2025-05-09", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 840000, type: "credit" },
  { id: 67, date: "2025-05-12", description: "Online Banking Transfer", details: "Sponsorship Ekhaya FC", accountCode: "EFC101-5001", amount: 7500000, type: "credit" },
  { id: 68, date: "2025-05-12", description: "Online Banking Transfer", details: "G Chitera Replicas", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 69, date: "2025-05-16", description: "Mobile Banking Transfer", details: "From: MICHAEL EDWARD", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 70, date: "2025-05-16", description: "Cash Deposit", details: "BLESSINGS GWEMBELE", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 71, date: "2025-05-16", description: "Cash Deposit", details: "BLESSINGS GWEMBELE", accountCode: "EFC101-5003", amount: 150000, type: "credit" },
  { id: 72, date: "2025-05-16", description: "Transfer In", details: "TANAKA PHILIP CH", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 73, date: "2025-05-16", description: "Transfer In", details: "GAZA INVESTMENTS", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 74, date: "2025-05-16", description: "Transfer In", details: "PETER MUKHITO", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 75, date: "2025-05-16", description: "Transfer In", details: "From Acc.No. 1040100794395", accountCode: "EFC101-5003", amount: 146000, type: "credit" },
  { id: 76, date: "2025-05-16", description: "Transfer In", details: "MR STANISLAUS SA", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 77, date: "2025-05-17", description: "Online Banking Transfer", details: "Kamuzu Barracks vs Ekhaya FC", accountCode: "EFC101-5002", amount: 143000, type: "credit" },
  { id: 78, date: "2025-05-19", description: "Transfer In", details: "DANIEL CHILIMA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 79, date: "2025-05-19", description: "Cash Deposit", details: "JENNIFER CHAPOTERA", accountCode: "EFC101-5002", amount: 208500, type: "credit" },
  { id: 80, date: "2025-05-19", description: "Cash Deposit", details: "BLESSINGS", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 81, date: "2025-05-20", description: "Online Banking Transfer", details: "Nazil Jerseys", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 82, date: "2025-05-20", description: "Transfer In", details: "ROMEO", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 83, date: "2025-05-21", description: "Transfer In", details: "MPHATSO ZANGALAM", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 84, date: "2025-05-21", description: "Transfer In", details: "From Acc.No. MWK1472000190001", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 85, date: "2025-05-22", description: "Cash Deposit", details: "GATE COLLECTION BY G MANDOWA", accountCode: "EFC101-5002", amount: 418000, type: "credit" },
  { id: 86, date: "2025-05-22", description: "Mobile Banking Transfer", details: "From: CHIPUNGU ALEX KENNIE", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 87, date: "2025-05-22", description: "Online Banking Transfer", details: "Sponsorship Ekhaya FC Mibawa", accountCode: "EFC101-5005", amount: 1500000, type: "credit" },
  { id: 88, date: "2025-05-23", description: "Online Banking Transfer", details: "Funds Transfer for salaries", accountCode: "", amount: 16000000, type: "debit" },
  { id: 89, date: "2025-05-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 163000, type: "debit" },
  { id: 90, date: "2025-05-30", description: "Transfer In", details: "HAMISI TADALA", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 91, date: "2025-05-30", description: "Transfer In", details: "GAZA INVESTMENTS", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 92, date: "2025-05-30", description: "Transfer In", details: "CHIMENYA ANTHONY", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 93, date: "2025-05-30", description: "Transfer In", details: "MR JEFFREY LIMBI", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 94, date: "2025-05-30", description: "Online Banking Transfer", details: "Jersey", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 95, date: "2025-05-31", description: "Transfer In", details: "From Acc.No. MWK1472000190001", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 96, date: "2025-06-02", description: "Transfer In", details: "TIKHALA S MBEDZA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 97, date: "2025-06-02", description: "Cash Deposit", details: "JENNIFER CHAPOTERA", accountCode: "EFC101-5002", amount: 48000, type: "credit" },
  { id: 98, date: "2025-06-04", description: "Mobile Banking Transfer", details: "From: MATHEWS MTIMAUKANENA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 99, date: "2025-06-04", description: "Online Banking Transfer", details: "TP Mpinganjira Shirts", accountCode: "EFC101-5003", amount: 660000, type: "credit" },
  { id: 100, date: "2025-06-05", description: "Transfer In", details: "SUPER LEAGUE ASS", accountCode: "EFC101-5002", amount: 270000, type: "credit" },
  { id: 101, date: "2025-06-05", description: "Cash Deposit", details: "G MKOMADZINJA", accountCode: "EFC101-5002", amount: 750000, type: "credit" },
  { id: 102, date: "2025-06-06", description: "Mobile Banking Transfer", details: "From: LIMBANI LUNDU", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 103, date: "2025-06-10", description: "Transfer In", details: "MS RUTH SHUMBA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 104, date: "2025-06-10", description: "Transfer In", details: "MS RUTH SHUMBA", accountCode: "EFC101-5003", amount: 0, type: "credit" },
  { id: 105, date: "2025-06-10", description: "Transfer In", details: "MS RUTH SHUMBA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 106, date: "2025-06-10", description: "Transfer In", details: "PANGANI EVANCE", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 107, date: "2025-06-11", description: "EFT Incoming", details: "MISS PATRICIA NANKHU", accountCode: "EFC101-5003", amount: 180000, type: "credit" },
  { id: 108, date: "2025-06-13", description: "Transfer In", details: "MRS ELIZABETH BL", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 109, date: "2025-06-13", description: "Mobile Banking Transfer", details: "From: BERSON SENZANI", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 110, date: "2025-06-13", description: "Cash Deposit", details: "BLESSINGS", accountCode: "EFC101-5003", amount: 1337000, type: "credit" },
  { id: 111, date: "2025-06-16", description: "Cash Deposit", details: "EKHAYA VS CLERK", accountCode: "EFC101-5002", amount: 51770, type: "credit" },
  { id: 112, date: "2025-06-17", description: "Transfer In", details: "MALIRAKWENDA RIC", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 113, date: "2025-06-17", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 60000, type: "credit" },
  { id: 114, date: "2025-06-17", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 115, date: "2025-06-17", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 116, date: "2025-06-17", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 117, date: "2025-06-17", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 1800000, type: "credit" },
  { id: 118, date: "2025-06-17", description: "Mobile Banking Transfer", details: "From: JACOB MWAKAJUMBA", accountCode: "EFC101-5003", amount: 180000, type: "credit" },
  { id: 119, date: "2025-06-18", description: "Oneclick Bulk Payment", details: "2025 Club Subventions - Ekhaya FC", accountCode: "EFC101-5004", amount: 4500000, type: "credit" },
  { id: 120, date: "2025-06-23", description: "Cash Deposit", details: "ISAAC", accountCode: "EFC101-5002", amount: 249700, type: "credit" },
  { id: 121, date: "2025-06-25", description: "Online Banking Transfer", details: "Funds Transfer for salaries", accountCode: "", amount: 11000000, type: "debit" },
  { id: 122, date: "2025-06-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 163000, type: "debit" },
  { id: 123, date: "2025-06-27", description: "Transfer In", details: "PRISCILLA CHIPPO", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 124, date: "2025-06-28", description: "Mobile Banking Transfer", details: "From: ALLAN SABWERA", accountCode: "EFC101-5003", amount: 300000, type: "credit" },
  { id: 125, date: "2025-06-28", description: "Transfer In", details: "MUSTAFA GEOFFREY", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 126, date: "2025-06-30", description: "Cash Deposit", details: "ISHMAEL", accountCode: "EFC101-5002", amount: 1164064, type: "credit" },
  { id: 127, date: "2025-07-01", description: "Mobile Banking Transfer", details: "From: GEORGE FRANK", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 128, date: "2025-07-02", description: "Mobile Banking Transfer", details: "From: YAMIKANI NOEL NYIRENDA", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 129, date: "2025-07-02", description: "Mobile Banking Transfer", details: "From: YAMIKANI NOEL NYIRENDA", accountCode: "EFC101-5003", amount: 1080000, type: "credit" },
  { id: 130, date: "2025-07-02", description: "Transfer In", details: "DUNCAN FRANK MAB", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 131, date: "2025-07-02", description: "Mobile Banking Transfer", details: "From: PEMPHO MUSSA MAKINA", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 132, date: "2025-07-03", description: "Cash Deposit", details: "EKHAYA VS BULLETS IDAH CHANZA", accountCode: "EFC101-5002", amount: 672780, type: "credit" },
  { id: 133, date: "2025-07-03", description: "Transfer In", details: "SHINGIRAI MBENDE", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 134, date: "2025-07-03", description: "Transfer In", details: "TYRE XPRESS TYRE", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 135, date: "2025-07-04", description: "Online Banking Transfer", details: "Transfer Operations Account", accountCode: "", amount: 6000000, type: "debit" },
  { id: 136, date: "2025-07-04", description: "Online Banking Transfer", details: "Transfer to Salaries Account", accountCode: "", amount: 20000000, type: "debit" },
  { id: 137, date: "2025-07-04", description: "Cash Deposit", details: "BLESSINGS FOR REPLICA JERSEY", accountCode: "EFC101-5003", amount: 1130000, type: "credit" },
  { id: 138, date: "2025-07-04", description: "Oneclick Bulk Payment", details: "Contribution For Ekhaya Football", accountCode: "EFC101-5005", amount: 1500000, type: "credit" },
  { id: 139, date: "2025-07-04", description: "Transfer In", details: "NYAMBALO ANDREW", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 140, date: "2025-07-04", description: "Cash Deposit", details: "GILBERT MSINDA", accountCode: "EFC101-5003", amount: 450000, type: "credit" },
  { id: 141, date: "2025-07-04", description: "Mobile Banking Transfer", details: "From: AUBREY NYIRONGO", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 142, date: "2025-07-05", description: "Transfer", details: "Motor Vehicle maintenance", accountCode: "EFC101-5003", amount: 471961, type: "credit" },
  { id: 143, date: "2025-07-08", description: "Mobile Banking Transfer", details: "From: RONALD CHIMCHERE", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 144, date: "2025-07-10", description: "Mobile Banking Transfer", details: "From: ANTHONY BLAZIO MASAMBA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 145, date: "2025-07-10", description: "Mobile Banking Transfer", details: "From: STELLA MSOSA", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 146, date: "2025-07-10", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 4500000, type: "credit" },
  { id: 147, date: "2025-07-10", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 148, date: "2025-07-10", description: "Transfer In", details: "MANDIZA JAMES K", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 149, date: "2025-07-11", description: "Transfer In", details: "MR TALUMBA NAMAT", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 150, date: "2025-07-11", description: "Transfer In", details: "BRIDGET KALIMANJ", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 151, date: "2025-07-11", description: "Transfer In", details: "MR ANDREW MALISE", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 152, date: "2025-07-11", description: "Transfer In", details: "THEODORE MWAYI K", accountCode: "EFC101-5003", amount: 216000, type: "credit" },
  { id: 153, date: "2025-07-14", description: "Cash Deposit", details: "EKHAYA VS WANDERERS GREGORY MANDOWA", accountCode: "EFC101-5002", amount: 1049285, type: "credit" },
  { id: 154, date: "2025-07-14", description: "Cash Deposit", details: "MONEY FOR REPLICA JERSEY", accountCode: "EFC101-5003", amount: 453000, type: "credit" },
  { id: 155, date: "2025-07-15", description: "Online Banking Transfer", details: "Transfer to Operations Account", accountCode: "", amount: 0, type: "debit" },
  { id: 156, date: "2025-07-16", description: "Online Banking Transfer", details: "Club President Replicas", accountCode: "EFC101-5003", amount: 396000, type: "credit" },
  { id: 157, date: "2025-07-16", description: "Online Banking Transfer", details: "Kumbu Jimusole Replica", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 158, date: "2025-07-16", description: "Mobile Banking Transfer", details: "From: STELLA RAXIE KAMWANA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 159, date: "2025-07-17", description: "Online Banking Transfer", details: "Ekhaya FC Zomba Hardelec", accountCode: "EFC101-5005", amount: 3000000, type: "credit" },
  { id: 160, date: "2025-07-17", description: "Online Banking Transfer", details: "Ekhaya FC Northgate Mibawa", accountCode: "EFC101-5005", amount: 4500000, type: "credit" },
  { id: 161, date: "2025-07-18", description: "Transfer In", details: "From Acc.No. 1970100076147", accountCode: "EFC101-5003", amount: 108000, type: "credit" },
  { id: 162, date: "2025-07-18", description: "Mobile Banking Transfer", details: "From: LUSEKELO DAVID MWALWANDA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 163, date: "2025-07-19", description: "Online Banking Transfer", details: "Ekhaya FC Resort", accountCode: "EFC101-5005", amount: 2000000, type: "credit" },
  { id: 164, date: "2025-07-19", description: "Online Banking Transfer", details: "EFC101-5002", accountCode: "EFC101-5002", amount: 14000000, type: "credit" },
  { id: 165, date: "2025-07-19", description: "Online Banking Transfer", details: "EFC101-5002", accountCode: "EFC101-5002", amount: 267950, type: "credit" },
  { id: 166, date: "2025-07-21", description: "Cash Deposit", details: "EKHAYA VS MOYALE GREGORY MANDOWA", accountCode: "EFC101-5002", amount: 1049285, type: "credit" },
  { id: 167, date: "2025-07-21", description: "Online Banking Transfer", details: "Ekhaya FC Mibawa", accountCode: "EFC101-5005", amount: 1500000, type: "credit" },
  { id: 168, date: "2025-07-22", description: "Transfer In", details: "LIKWEMBA LOUIS", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 169, date: "2025-07-22", description: "Mobile Banking Transfer", details: "From: ADAM MBETA", accountCode: "EFC101-5003", amount: 760000, type: "credit" },
  { id: 170, date: "2025-07-24", description: "Online Banking Transfer", details: "Transfer to Salaries AC", accountCode: "", amount: 0, type: "debit" },
  { id: 171, date: "2025-07-24", description: "Online Banking Transfer", details: "Ekhaya FC Mangochi", accountCode: "EFC101-5005", amount: 1500000, type: "credit" },
  { id: 172, date: "2025-07-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 191000, type: "debit" },
  { id: 173, date: "2025-07-29", description: "Transfer In", details: "AKUZIKE KUNYUMBU", accountCode: "EFC101-5003", amount: 108000, type: "credit" },
  { id: 174, date: "2025-07-30", description: "Cash Deposit", details: "MIKE LEMEKANI", accountCode: "EFC101-5002", amount: 1431000, type: "credit" },
  { id: 175, date: "2025-07-30", description: "EFT Incoming", details: "EDEN FARMS", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 176, date: "2025-07-31", description: "Transfer In", details: "MR HARRY SAMBANI", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 177, date: "2025-07-31", description: "Transfer In", details: "MACDONALD MTUWA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 178, date: "2025-08-01", description: "Online Banking Transfer", details: "Transfer to Operations Account", accountCode: "", amount: 0, type: "debit" },
  { id: 179, date: "2025-08-04", description: "Transfer In", details: "LIMBANI CHAKHOMA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 180, date: "2025-08-04", description: "Mobile Banking Transfer", details: "From: ALICK LUNGU", accountCode: "EFC101-5003", amount: 367500, type: "credit" },
  { id: 181, date: "2025-08-05", description: "Oneclick Bulk Payment", details: "Contribution For EKHAYA FOOTBALL", accountCode: "EFC101-5005", amount: 1500000, type: "credit" },
  { id: 182, date: "2025-08-06", description: "EFT Incoming", details: "CIVIL SERVICE UNITED", accountCode: "EFC101-5005", amount: 4500000, type: "credit" },
  { id: 183, date: "2025-08-06", description: "Transfer In", details: "INESS CHIKAFA", accountCode: "EFC101-5005", amount: 12000000, type: "credit" },
  { id: 184, date: "2025-08-06", description: "Transfer", details: "Reversal Wrong Account Deposit", accountCode: "", amount: 16300, type: "debit" },
  { id: 185, date: "2025-08-08", description: "Cash Deposit", details: "AMON CHIRWA", accountCode: "EFC101-5003", amount: 4000000, type: "credit" },
  { id: 186, date: "2025-08-08", description: "Transfer In", details: "SHIFT COMPANY LTD", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 187, date: "2025-08-09", description: "Transfer In", details: "MR CHIMWEMWE JUW", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 188, date: "2025-08-11", description: "Transfer In", details: "MISS WINNIE MALE", accountCode: "EFC101-5003", amount: 170000, type: "credit" },
  { id: 189, date: "2025-08-11", description: "Cash Deposit", details: "CIVIL VS WANDERERS MIKE", accountCode: "EFC101-5002", amount: 1000000, type: "credit" },
  { id: 190, date: "2025-08-13", description: "Transfer In", details: "MBAYA MORRIS MAT", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 191, date: "2025-08-14", description: "Transfer In", details: "RONALD ZELEZA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 192, date: "2025-08-14", description: "EFT Incoming", details: "MISS PRISCA NJONJO K", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 193, date: "2025-08-15", description: "Online Banking Transfer", details: "Transfer to Operations Account", accountCode: "", amount: 0, type: "debit" },
  { id: 194, date: "2025-08-18", description: "Transfer In", details: "BLESSINGS KAPHIK", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 195, date: "2025-08-19", description: "Cash Deposit", details: "JK", accountCode: "EFC101-5002", amount: 830000, type: "credit" },
  { id: 196, date: "2025-08-19", description: "Mobile Banking Transfer", details: "From: EMMANUEL VINCENT NANTHURU", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 197, date: "2025-08-19", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 450000, type: "credit" },
  { id: 198, date: "2025-08-19", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 4000000, type: "credit" },
  { id: 199, date: "2025-08-25", description: "Online Banking Transfer", details: "EFC101-5002", accountCode: "EFC101-5002", amount: 297500, type: "credit" },
  { id: 200, date: "2025-08-25", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 201, date: "2025-08-25", description: "Mobile Banking Transfer", details: "From: PEMPHO MUSSA MAKINA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 202, date: "2025-08-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 16300, type: "debit" },
  { id: 203, date: "2025-08-28", description: "Cash Deposit", details: "GREGORY MANDOWA", accountCode: "EFC101-5002", amount: 3000000, type: "credit" },
  { id: 204, date: "2025-08-28", description: "Mobile Banking Transfer", details: "From: FRANCIS MKONDA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 205, date: "2025-08-29", description: "Cash Deposit", details: "JENNIFER CHAPOTERA", accountCode: "EFC101-5002", amount: 530000, type: "credit" },
  { id: 206, date: "2025-09-01", description: "Mobile Banking Transfer", details: "From: UPILE CHIWAYA", accountCode: "EFC101-5003", amount: 300000, type: "credit" },
  { id: 207, date: "2025-09-02", description: "Online Banking Transfer", details: "President Inv 049", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 208, date: "2025-09-02", description: "Online Banking Transfer", details: "President Inv 015", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 209, date: "2025-09-02", description: "Online Banking Transfer", details: "President Inv 008", accountCode: "EFC101-5003", amount: 180000, type: "credit" },
  { id: 210, date: "2025-09-02", description: "Online Banking Transfer", details: "President Inv 010", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 211, date: "2025-09-02", description: "Online Banking Transfer", details: "President Inv 011", accountCode: "EFC101-5003", amount: 120000, type: "credit" },
  { id: 212, date: "2025-09-02", description: "Agent Deposit", details: "AGENT CASH DEPOSIT", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 213, date: "2025-09-02", description: "Online Banking Transfer", details: "President Invoice 047", accountCode: "EFC101-5003", amount: 180000, type: "credit" },
  { id: 214, date: "2025-09-04", description: "Agent Deposit", details: "AGENT CASH DEPOSIT", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 215, date: "2025-09-05", description: "Mobile Banking Transfer", details: "KMtambo Replicas", accountCode: "EFC101-5003", amount: 0, type: "credit" },
  { id: 216, date: "2025-09-05", description: "Oneclick Bulk Payment", details: "replica jerseys - Ekhaya Football", accountCode: "EFC101-5003", amount: 10000000, type: "credit" },
  { id: 217, date: "2025-09-06", description: "Cash Deposit", details: "HARRY MSISKA", accountCode: "EFC101-5007", amount: 720000, type: "credit" },
  { id: 218, date: "2025-09-09", description: "Transfer In", details: "PHIRI LINDANI WE", accountCode: "EFC101-5007", amount: 2693157, type: "credit" },
  { id: 219, date: "2025-09-09", description: "Mobile Banking Transfer", details: "From: CHIMWEMWE NKUNIKA", accountCode: "EFC101-5003", amount: 350000, type: "credit" },
  { id: 220, date: "2025-09-10", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 144000, type: "credit" },
  { id: 221, date: "2025-09-11", description: "Transfer", details: "Redirection of a cash deposit to FA", accountCode: "", amount: 4962680, type: "debit" },
  { id: 222, date: "2025-09-12", description: "Transfer In", details: "ROBINS GONDWE", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 223, date: "2025-09-12", description: "Online Banking Transfer", details: "President Inv 053", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 224, date: "2025-09-12", description: "Online Banking Transfer", details: "President Inv 054", accountCode: "EFC101-5003", amount: 144000, type: "credit" },
  { id: 225, date: "2025-09-13", description: "Online Banking Transfer", details: "Funds Transfer from Revenue AC to", accountCode: "", amount: 16000000, type: "debit" },
  { id: 226, date: "2025-09-17", description: "Transfer In", details: "MISS MIRRIAM RED", accountCode: "EFC101-5003", amount: 36500, type: "credit" },
  { id: 227, date: "2025-09-20", description: "Transfer In", details: "From Acc.No. 1040100794395", accountCode: "EFC101-5003", amount: 36500, type: "credit" },
  { id: 228, date: "2025-09-22", description: "Transfer In", details: "MR THANDO KASOM", accountCode: "EFC101-5003", amount: 54000, type: "credit" },
  { id: 229, date: "2025-09-24", description: "Transfer In", details: "From Acc.No. 1040100794395", accountCode: "EFC101-5003", amount: 108000, type: "credit" },
  { id: 230, date: "2025-09-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 163000, type: "debit" },
  { id: 231, date: "2025-09-26", description: "Mobile Banking Transfer", details: "From: CHIMWEMWE NKUNIKA", accountCode: "EFC101-5003", amount: 68400, type: "credit" },
  { id: 232, date: "2025-09-29", description: "Online Banking Transfer", details: "Ekhaya Jerseys", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 233, date: "2025-09-29", description: "Transfer In", details: "CHIPEYA BERNARD", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 234, date: "2025-09-29", description: "Cash Deposit", details: "ISHMAEL", accountCode: "EFC101-5003", amount: 2064000, type: "credit" },
  { id: 235, date: "2025-09-30", description: "Cash Deposit", details: "BLESSINGS GWEMBELE", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 236, date: "2025-10-06", description: "Mobile Banking Transfer", details: "From: STELLA RAXIE KAMWANA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 237, date: "2025-10-07", description: "Transfer In", details: "KANYENGE HANNA M", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 238, date: "2025-10-07", description: "EFT Incoming", details: "SUPER LEAGUE", accountCode: "EFC101-5006", amount: 5140603, type: "credit" },
  { id: 239, date: "2025-10-10", description: "Transfer In", details: "VANESSA UPILE KA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 240, date: "2025-10-10", description: "Mobile Banking Transfer", details: "From: SEBASTIAN KAMPEREWARA", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 241, date: "2025-10-14", description: "Mobile Banking Transfer", details: "From: CHIMWEMWE NKUNIKA", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 242, date: "2025-10-16", description: "Online Banking Transfer", details: "Funds Transfer from Revenue AC to", accountCode: "", amount: 16300, type: "debit" },
  { id: 243, date: "2025-10-16", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 244, date: "2025-10-17", description: "Transfer In", details: "MR AMMON CHIRWA", accountCode: "EFC101-5003", amount: 648000, type: "credit" },
  { id: 245, date: "2025-10-18", description: "Mobile Banking Transfer", details: "From: CHIMWEMWE NKUNIKA", accountCode: "EFC101-5003", amount: 216000, type: "credit" },
  { id: 246, date: "2025-10-22", description: "EFT Incoming", details: "HENDERSON MKANDAWIRE", accountCode: "EFC101-5003", amount: 600000, type: "credit" },
  { id: 247, date: "2025-10-22", description: "Online Banking Transfer", details: "Funds Transfer to Salaries Account", accountCode: "", amount: 0, type: "debit" },
  { id: 248, date: "2025-10-23", description: "Cash Deposit", details: "GREGORY MANDOWA", accountCode: "EFC101-5002", amount: 187000, type: "credit" },
  { id: 249, date: "2025-10-24", description: "Transfer In", details: "MR AMMON CHIRWA", accountCode: "EFC101-5003", amount: 432000, type: "credit" },
  { id: 250, date: "2025-10-24", description: "Oneclick Bulk Payment", details: "June 2025 Jersey-Loan Recoveries", accountCode: "EFC101-5003", amount: 1380000, type: "credit" },
  { id: 251, date: "2025-10-24", description: "Oneclick Bulk Payment", details: "Sept 2025 Jersey-Loan Recoveries", accountCode: "EFC101-5003", amount: 1440000, type: "credit" },
  { id: 252, date: "2025-10-24", description: "Oneclick Bulk Payment", details: "June 2025 Jersey-Loan Recoveries", accountCode: "EFC101-5003", amount: 1380000, type: "credit" },
  { id: 253, date: "2025-10-24", description: "Oneclick Bulk Payment", details: "Aug 2025 Jersey", accountCode: "EFC101-5003", amount: 3492000, type: "credit" },
  { id: 254, date: "2025-10-24", description: "Oneclick Bulk Payment", details: "Oct 2025 Jersey", accountCode: "EFC101-5003", amount: 654000, type: "credit" },
  { id: 255, date: "2025-10-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 163000, type: "debit" },
  { id: 256, date: "2025-10-28", description: "Cash Deposit", details: "EKHAYA VS BLUE EAGLES G MANDOWA", accountCode: "EFC101-5002", amount: 977000, type: "credit" },
  { id: 257, date: "2025-11-01", description: "Transfer In", details: "TMUSKAMBO", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 258, date: "2025-11-03", description: "EFT Incoming", details: "SUPER LEAGUE ASSOCIATION", accountCode: "EFC101-5006", amount: 4500000, type: "credit" },
  { id: 259, date: "2025-11-03", description: "Transfer In", details: "SUPER LEAGUE ASS", accountCode: "EFC101-5002", amount: 30000000, type: "credit" },
  { id: 260, date: "2025-11-03", description: "Online Banking Transfer", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 16300, type: "credit" },
  { id: 261, date: "2025-11-04", description: "Online Banking Transfer", details: "Funds Transfer from Revenue AC to", accountCode: "", amount: 16000000, type: "debit" },
  { id: 262, date: "2025-11-05", description: "Mobile Banking Transfer", details: "From: KAKHOBWE MAYAMIKO", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 263, date: "2025-11-10", description: "Transfer In", details: "ISAAC", accountCode: "EFC101-5003", amount: 180000, type: "credit" },
  { id: 264, date: "2025-11-13", description: "Transfer In", details: "JERSEY SALES", accountCode: "EFC101-5003", amount: 165000, type: "credit" },
  { id: 265, date: "2025-11-13", description: "Transfer In", details: "Cash Deposit JERSEY SALES", accountCode: "EFC101-5003", amount: 1152000, type: "credit" },
  { id: 266, date: "2025-11-18", description: "Oneclick Bulk Payment", details: "Ekhaya FC 071", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 267, date: "2025-11-19", description: "Transfer In", details: "From Acc.No. MWK1472000190001", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 268, date: "2025-11-21", description: "Transfer In", details: "MR WEBSTER PRINC", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 269, date: "2025-11-21", description: "Transfer In", details: "MR KENNEDY NKHAW", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 270, date: "2025-11-22", description: "Agent Deposit", details: "AGENT CASH DEPOSIT", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 271, date: "2025-11-22", description: "Mobile Banking Transfer", details: "From: JUSTIN NKANDO", accountCode: "EFC101-5003", amount: 350000, type: "credit" },
  { id: 272, date: "2025-11-24", description: "Transfer In", details: "MR KELVIN MALING", accountCode: "EFC101-5003", amount: 360000, type: "credit" },
  { id: 273, date: "2025-11-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 0, type: "debit" },
  { id: 274, date: "2025-11-27", description: "Oneclick Bulk Payment", details: "Nov 2025 Jersey-Loan Recoveries", accountCode: "EFC101-5003", amount: 1404000, type: "credit" },
  { id: 275, date: "2025-11-28", description: "Cash Deposit", details: "JERSEY SALES BY BRIGHT NYAUTI", accountCode: "EFC101-5003", amount: 864000, type: "credit" },
  { id: 276, date: "2025-12-01", description: "Mobile Banking Transfer", details: "From: FRANCIS PATRICK MACLAY MADONA", accountCode: "EFC101-5003", amount: 700000, type: "credit" },
  { id: 277, date: "2025-12-02", description: "Cash Deposit", details: "SAM BANDA", accountCode: "EFC101-5002", amount: 825750, type: "credit" },
  { id: 278, date: "2025-12-03", description: "Online Banking Transfer", details: "Nandos Replica Inv 080", accountCode: "EFC101-5003", amount: 9500000, type: "credit" },
  { id: 279, date: "2025-12-03", description: "Online Banking Transfer", details: "Chileka Replica Inv 079", accountCode: "EFC101-5003", amount: 4400000, type: "credit" },
  { id: 280, date: "2025-12-05", description: "Cash Deposit", details: "EFC101-5003", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 281, date: "2025-12-08", description: "Mobile Banking Transfer", details: "From: YAMIKANI NOEL NYIRENDA", accountCode: "EFC101-5003", amount: 2373055, type: "credit" },
  { id: 282, date: "2025-12-08", description: "Cash Deposit", details: "MPHATSO KASIYA", accountCode: "EFC101-5003", amount: 0, type: "credit" },
  { id: 283, date: "2025-12-09", description: "Online Banking Transfer", details: "Funds Transfer from Revenue AC to", accountCode: "", amount: 0, type: "debit" },
  { id: 284, date: "2025-12-11", description: "Cash Deposit", details: "EKHAYA vs SILVER", accountCode: "EFC101-5002", amount: 250000, type: "credit" },
  { id: 285, date: "2025-12-15", description: "Transfer In", details: "MS WONGANI NKHOM", accountCode: "EFC101-5003", amount: 200000, type: "credit" },
  { id: 286, date: "2025-12-16", description: "Cash Deposit", details: "GREGORY MANDOWA", accountCode: "EFC101-5002", amount: 1708000, type: "credit" },
  { id: 287, date: "2025-12-16", description: "Transfer In", details: "SUPER LEAGUE ASS", accountCode: "EFC101-5004", amount: 45000000, type: "credit" },
  { id: 288, date: "2025-12-18", description: "Transfer In", details: "SUPER LEAGUE ASS", accountCode: "EFC101-5004", amount: 50000000, type: "credit" },
  { id: 289, date: "2025-12-18", description: "Transfer In", details: "SUPER LEAGUE ASS", accountCode: "EFC101-5006", amount: 127387, type: "credit" },
  { id: 290, date: "2025-12-19", description: "Transfer In", details: "DAVID CHIYEMBEKE", accountCode: "EFC101-5003", amount: 720000, type: "credit" },
  { id: 291, date: "2025-12-22", description: "Online Banking Transfer", details: "Funds Transfer from Revenue AC to", accountCode: "", amount: 0, type: "debit" },
  { id: 292, date: "2025-12-22", description: "Mobile Banking Transfer", details: "From: DANIEL KAZIMA", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 293, date: "2025-12-24", description: "Oneclick Bulk Payment", details: "Staff Loan Recoveries", accountCode: "EFC101-5003", amount: 1176000, type: "credit" },
  { id: 294, date: "2025-12-24", description: "Oneclick Bulk Payment", details: "Dec 2025 Jersey", accountCode: "EFC101-5003", amount: 0, type: "credit" },
  { id: 295, date: "2025-12-26", description: "Fees Debited", details: "Bank Charges", accountCode: "", amount: 960000, type: "debit" },
  { id: 296, date: "2025-12-27", description: "Mobile Banking Transfer", details: "From: DAMSON MADALITSO SULUMA", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 297, date: "2025-12-27", description: "Mobile Banking Transfer", details: "From: JIMMY TAULO", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 298, date: "2025-12-27", description: "Mobile Banking Transfer", details: "From: ISHMAEL MANGANI", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 299, date: "2025-12-29", description: "Transfer In", details: "PATRICK MKONDA", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 300, date: "2025-12-29", description: "Transfer In", details: "CHIPEYA BERNARD", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 301, date: "2025-12-29", description: "Transfer In", details: "JARDON SAM THEU", accountCode: "EFC101-5003", amount: 960000, type: "credit" },
  { id: 302, date: "2025-12-29", description: "Transfer In", details: "CHIPEYA BERNARD", accountCode: "EFC101-5003", amount: 240000, type: "credit" },
  { id: 303, date: "2025-12-29", description: "Mobile Banking Transfer", details: "From: KONDWANI MAURICE CHAPOLA", accountCode: "EFC101-5003", amount: 480000, type: "credit" },
  { id: 304, date: "2025-12-31", description: "Transfer", details: "Dec 25 Payroll Remittances Reversal", accountCode: "", amount: 5306910, type: "debit" },
  { id: 305, date: "2025-12-31", description: "Transfer In", details: "SUPER LEAGUE ASS", accountCode: "EFC101-5006", amount: 7433, type: "credit" },
];

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
  const [catFilter, setCatFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", dir: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 25;

  const categories = Object.values(REVENUE_ACCOUNTS);

  const processedData = useMemo(() => {
    let balance = 0;
    return INITIAL_CASHBOOK.map(tx => {
      const amt = tx.type === "credit" ? tx.amount : -tx.amount;
      balance += amt;
      const cat = REVENUE_ACCOUNTS[tx.accountCode] || null;
      return { ...tx, balance, category: cat, catAmount: cat ? tx.amount : 0 };
    });
  }, []);

  const totals = useMemo(() => {
    const t = {};
    categories.forEach(c => { t[c] = 0; });
    let totalCredit = 0, totalDebit = 0;
    INITIAL_CASHBOOK.forEach(tx => {
      if (tx.type === "credit") totalCredit += tx.amount;
      else totalDebit += tx.amount;
      const cat = REVENUE_ACCOUNTS[tx.accountCode];
      if (cat) t[cat] += tx.amount;
    });
    return { categories: t, totalCredit, totalDebit, closingBalance: totalCredit - totalDebit + 92200 };
  }, []);

  const filtered = useMemo(() => {
    let rows = [...processedData];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.description.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q) ||
        r.date.includes(q) ||
        (r.accountCode && r.accountCode.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q))
      );
    }
    if (catFilter !== "all") rows = rows.filter(r => r.category === catFilter);
    rows.sort((a, b) => {
      const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (typeof aVal === "string") return sortConfig.dir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortConfig.dir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return rows;
  }, [processedData, search, catFilter, sortConfig]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSort = (key) => {
    setSortConfig(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const exportCSV = () => {
    const headers = ["Date", "Description", "Details", "Account Code", "Category", "Debit", "Credit", "Running Balance"];
    const rows = filtered.map(r => [
      r.date, r.description, r.details, r.accountCode, r.category || "",
      r.type === "debit" ? r.amount : "",
      r.type === "credit" ? r.amount : "",
      r.balance
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cashbook_revenue_2025.csv";
    a.click();
  };

  const cardStyle = { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px" };
  const thStyle = { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const tdStyle = { padding: "10px 12px", fontSize: 13, borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, whiteSpace: "nowrap" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: COLORS.gold, fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Revenue Cashbook 2025</h2>
          <p style={{ color: COLORS.muted, fontSize: 12, margin: "4px 0 0" }}>Account: EFC101 | Opening Balance: MWK 92,200 | {processedData.length} transactions</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input style={{ ...inputStyle, width: 200 }} placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          <select style={{ ...inputStyle, width: 160 }} value={catFilter} onChange={e => { setCatFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={exportCSV} style={{ background: COLORS.gold, color: "#000", fontWeight: 600, fontSize: 12, padding: "8px 14px", borderRadius: 7, border: "none", cursor: "pointer" }}>Export CSV</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.success}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Total Credits</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.success, marginTop: 4 }}>MWK {totals.totalCredit.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.danger}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Total Debits</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.danger, marginTop: 4 }}>MWK {totals.totalDebit.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.gold}` }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase" }}>Closing Balance</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gold, marginTop: 4 }}>MWK {totals.closingBalance.toLocaleString()}</div>
        </div>
        {categories.map(c => (
          <div key={c} style={{ ...cardStyle, borderLeft: `3px solid ${COLORS.goldLight}` }}>
            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginTop: 4 }}>MWK {totals.categories[c].toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div style={cardStyle}>
        <h3 style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Revenue by Category</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {categories.map(c => {
            const val = totals.categories[c];
            const pct = totals.totalCredit > 0 ? ((val / totals.totalCredit) * 100).toFixed(1) : 0;
            return (
              <div key={c} style={{ padding: "10px 14px", background: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: COLORS.muted }}>{c}</span>
                  <span style={{ fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginTop: 4 }}>MWK {val.toLocaleString()}</div>
                <div style={{ height: 4, background: COLORS.border, borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: COLORS.gold, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
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
                  { key: "description", label: "Description" },
                  { key: "details", label: "Details" },
                  { key: "accountCode", label: "Account Code" },
                  { key: "category", label: "Category" },
                  { key: "type", label: "Dr/Cr" },
                  { key: "amount", label: "Amount" },
                  { key: "balance", label: "Running Balance" },
                ].map(col => (
                  <th key={col.key} style={thStyle} onClick={() => handleSort(col.key)}>
                    {col.label} {sortConfig.key === col.key ? (sortConfig.dir === "asc" ? "\u25B2" : "\u25BC") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "transparent" : COLORS.surface }}>
                  <td style={tdStyle}>{r.date}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{r.description}</td>
                  <td style={{ ...tdStyle, whiteSpace: "normal", maxWidth: 260 }}>{r.details}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, color: r.accountCode ? COLORS.gold : COLORS.muted }}>
                    {r.accountCode || "\u2014"}
                  </td>
                  <td style={tdStyle}>
                    {r.category ? (
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: COLORS.gold + "22", color: COLORS.gold, border: `1px solid ${COLORS.gold}44` }}>
                        {r.category}
                      </span>
                    ) : "\u2014"}
                  </td>
                  <td style={{ ...tdStyle, color: r.type === "debit" ? COLORS.danger : COLORS.success, fontWeight: 600, textAlign: "center" }}>
                    {r.type === "debit" ? "Dr" : "Cr"}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, textAlign: "right", color: r.type === "debit" ? COLORS.danger : COLORS.success }}>
                    {r.type === "debit" ? "(" : ""}MWK {r.amount.toLocaleString()}{r.type === "debit" ? ")" : ""}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, textAlign: "right", color: r.balance >= 0 ? COLORS.text : COLORS.danger }}>
                    MWK {r.balance.toLocaleString()}
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

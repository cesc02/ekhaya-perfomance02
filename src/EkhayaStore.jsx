import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ShoppingBag, Search, X, Heart, Shirt, ChevronRight, Plus, Minus,
  Truck, RotateCcw, ShieldCheck, Menu, Check, Landmark,
  Smartphone, ArrowLeft, Lock, Settings, Trash2, RotateCcw as ResetIcon, Upload,
} from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
`;

const CSS = `
${FONTS}
:root{
  --gold:#B9922E;
  --gold-deep:#8F6F1F;
  --gold-light:#E8CD82;
  --gold-pale:#F7EFD9;
  --white:#FFFFFF;
  --cream:#FBFAF6;
  --ink:#141414;
  --ink-soft:#5C5A54;
  --line:rgba(20,20,20,0.12);
  --error:#B3261E;
}
.ekhaya{
  font-family:'Work Sans',sans-serif;
  background:var(--cream);
  color:var(--ink);
  min-height:100vh;
  width:100%;
  position:relative;
}
.ekhaya *{box-sizing:border-box;}
.ekhaya .display{
  font-family:'Anton',sans-serif;
  font-weight:400;
  letter-spacing:0.01em;
  text-transform:uppercase;
  line-height:0.95;
}
.ekhaya .mono{font-family:'JetBrains Mono',monospace;}

.sparkle{display:inline-block;width:10px;height:10px;flex-shrink:0;}

.util-bar{
  background:var(--ink);
  color:var(--gold-light);
  font-size:11.5px;
  letter-spacing:0.06em;
  text-transform:uppercase;
  padding:7px 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.main-nav{
  background:var(--white);
  border-bottom:1px solid var(--line);
  padding:12px 20px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  flex-wrap:wrap;
}
.brand{display:flex;align-items:center;gap:10px;}
.brand-logo{width:44px;height:44px;border-radius:8px;object-fit:cover;}
.brand-word{
  font-family:'Anton',sans-serif;
  font-size:19px;
  letter-spacing:0.02em;
  text-transform:uppercase;
  color:var(--ink);
  line-height:1.05;
}
.brand-word span{display:block;font-size:10px;letter-spacing:0.18em;color:var(--gold-deep);font-family:'Work Sans',sans-serif;font-weight:600;}
.gender-toggle{
  display:flex;
  background:var(--gold-pale);
  border-radius:999px;
  padding:3px;
  gap:3px;
}
.gender-toggle button{
  border:none;
  background:transparent;
  color:var(--ink);
  font-family:'Anton',sans-serif;
  font-size:13px;
  letter-spacing:0.05em;
  text-transform:uppercase;
  padding:8px 22px;
  border-radius:999px;
  cursor:pointer;
  transition:all .2s ease;
}
.gender-toggle button.active{
  background:var(--gold);
  color:var(--white);
}
.nav-icons{display:flex;align-items:center;gap:14px;}
.icon-btn{
  background:none;border:none;color:var(--ink);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  padding:6px;border-radius:6px;position:relative;
}
.icon-btn:hover{background:var(--gold-pale);}
.icon-btn:focus-visible{outline:2px solid var(--gold);outline-offset:2px;}
.cart-count{
  position:absolute;top:-2px;right:-2px;
  background:var(--gold-deep);color:var(--white);
  font-size:10px;font-weight:700;
  width:16px;height:16px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
}
.category-strip{
  background:var(--white);
  border-bottom:1px solid var(--line);
  padding:0 20px 12px;
  display:flex;
  gap:26px;
  overflow-x:auto;
}
.category-strip button{
  background:none;border:none;color:var(--ink-soft);
  font-size:13px;letter-spacing:0.06em;text-transform:uppercase;
  padding:6px 2px;cursor:pointer;white-space:nowrap;
  border-bottom:2px solid transparent;
}
.category-strip button.active{color:var(--ink);border-bottom-color:var(--gold);font-weight:600;}

.hero{
  position:relative;
  background:var(--white);
  color:var(--ink);
  padding:64px 20px 56px;
  overflow:hidden;
  border-bottom:1px solid var(--line);
}
.hero-badge-watermark{
  position:absolute; right:-60px; top:50%; transform:translateY(-50%);
  width:420px; height:420px; opacity:0.06; pointer-events:none;
}
.hero-inner{max-width:1180px;margin:0 auto;position:relative;z-index:1;}
.hero-eyebrow{
  font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--gold-deep);margin-bottom:14px;font-weight:600;
  display:flex;align-items:center;gap:8px;
}
.hero h1{
  font-size:clamp(40px,7vw,84px);
  max-width:760px;
  margin:0 0 18px;
}
.hero p{
  font-size:17px;max-width:520px;line-height:1.55;
  color:var(--ink-soft);margin:0 0 30px;
}
.hero-ctas{display:flex;gap:14px;flex-wrap:wrap;}
.btn{
  font-family:'Anton',sans-serif;
  font-size:14px;letter-spacing:0.05em;text-transform:uppercase;
  padding:15px 28px;border-radius:3px;border:2px solid transparent;
  cursor:pointer;display:inline-flex;align-items:center;gap:8px;
  transition:transform .15s ease, background .15s ease;
}
.btn:hover{transform:translateY(-1px);}
.btn:focus-visible{outline:2px solid var(--gold-deep);outline-offset:3px;}
.btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
.btn-gold{background:var(--gold);color:var(--white);}
.btn-gold:hover{background:var(--gold-deep);}
.btn-outline{background:transparent;color:var(--ink);border-color:var(--ink);}
.btn-outline:hover{border-color:var(--gold-deep);color:var(--gold-deep);}
.btn-ink{background:var(--ink);color:var(--white);}
.btn-ink:hover{background:#000;}

.section{max-width:1180px;margin:0 auto;padding:60px 20px;}
.section-head{
  display:flex;justify-content:space-between;align-items:flex-end;
  margin-bottom:28px;gap:16px;flex-wrap:wrap;
}
.section-head h2{font-size:clamp(26px,4vw,40px);margin:0;}
.section-head p.eyebrow{
  font-size:12px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--gold-deep);font-weight:600;margin:0 0 6px;
  display:flex;align-items:center;gap:7px;
}
.view-all{
  font-size:13px;letter-spacing:0.04em;text-transform:uppercase;
  color:var(--ink);font-weight:600;background:none;border:none;
  cursor:pointer;display:flex;align-items:center;gap:4px;
}

.tile-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:14px;
}
.tile{
  position:relative;border:1px solid var(--line);cursor:pointer;text-align:left;
  background:var(--white);color:var(--ink);
  border-radius:4px;padding:22px 18px;min-height:140px;
  display:flex;flex-direction:column;justify-content:space-between;
  overflow:hidden;transition:transform .18s ease, border-color .18s ease;
}
.tile:hover{transform:translateY(-3px);border-color:var(--gold);}
.tile-label{font-family:'Anton',sans-serif;font-size:19px;letter-spacing:0.02em;}
.tile-sub{font-size:12px;color:var(--ink-soft);margin-top:4px;}

.product-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:22px;
}
.card{
  background:#fff;border:1px solid var(--line);border-radius:6px;
  overflow:hidden;display:flex;flex-direction:column;
}
.card-media{
  background:var(--gold-pale);aspect-ratio:4/5;position:relative;
  display:flex;align-items:center;justify-content:center;
  color:var(--gold-deep);
}
.card-media .badge{
  position:absolute;top:10px;left:10px;
  background:var(--ink);color:var(--white);font-size:10.5px;font-weight:700;
  letter-spacing:0.05em;text-transform:uppercase;padding:4px 8px;border-radius:2px;
}
.card-media .badge.new{background:var(--gold);color:var(--white);}
.wish-btn{
  position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.9);
  border:none;border-radius:50%;width:30px;height:30px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink);
}
.wish-btn.active{color:var(--gold-deep);}
.card-body{padding:14px 14px 16px;display:flex;flex-direction:column;gap:8px;flex:1;}
.card-title{font-size:14.5px;font-weight:600;line-height:1.3;}
.card-collection{font-size:11px;color:var(--ink-soft);letter-spacing:0.04em;text-transform:uppercase;}
.card-price{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;margin-top:auto;}
.size-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px;}
.size-chip{
  border:1px solid var(--line);background:#fff;font-size:11.5px;
  padding:5px 9px;border-radius:3px;cursor:pointer;font-family:'JetBrains Mono',monospace;
}
.size-chip.active{border-color:var(--gold);background:var(--gold);color:#fff;}
.add-btn{
  margin-top:10px;background:var(--ink);color:var(--white);border:none;
  font-family:'Anton',sans-serif;font-size:12.5px;letter-spacing:0.05em;
  text-transform:uppercase;padding:11px;border-radius:3px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:6px;
}
.add-btn:hover{background:#000;}
.add-btn.added{background:var(--gold-deep);}

.customizer{
  background:var(--white);border:1px solid var(--line);border-radius:8px;
  padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;
}
.jersey-preview{
  background:var(--gold-pale);
  border-radius:8px;padding:30px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:10px;min-height:280px;position:relative;
  border:2px dashed var(--gold-light);
}
.jersey-name{font-family:'Anton',sans-serif;font-size:22px;letter-spacing:0.08em;color:var(--gold-deep);}
.jersey-number{font-family:'Anton',sans-serif;font-size:64px;color:var(--ink);line-height:1;}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
.field label{font-size:11.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-soft);}
.field input, .field select{
  background:var(--white);border:1px solid var(--line);
  color:var(--ink);padding:10px 12px;border-radius:3px;font-family:'Work Sans',sans-serif;font-size:14px;
}
.field input:focus, .field select:focus{outline:2px solid var(--gold);outline-offset:1px;}
.field input.err{border-color:var(--error);}
.field .err-msg{font-size:11.5px;color:var(--error);}
.field input::placeholder{color:#a8a49a;}
.kit-choice-row{display:flex;gap:8px;}
.kit-choice-row button{
  flex:1;border:1px solid var(--line);background:var(--white);color:var(--ink);
  padding:9px;border-radius:3px;font-size:12.5px;cursor:pointer;text-transform:uppercase;letter-spacing:0.03em;
}
.kit-choice-row button.active{background:var(--gold);color:var(--white);border-color:var(--gold);font-weight:700;}

.trust-strip{
  display:grid;grid-template-columns:repeat(3,1fr);gap:1px;
  background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);
}
.trust-item{
  padding:26px 20px;display:flex;align-items:center;gap:14px;background:var(--white);
}
.trust-item h4{margin:0 0 3px;font-size:14px;}
.trust-item p{margin:0;font-size:12.5px;color:var(--ink-soft);}

.footer{background:var(--ink);color:rgba(255,255,255,0.75);padding:56px 20px 28px;}
.footer-inner{max-width:1180px;margin:0 auto;}
.newsletter{
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;
  padding-bottom:36px;border-bottom:1px solid rgba(255,255,255,0.15);margin-bottom:36px;
}
.newsletter h3{color:var(--white);font-size:22px;margin:0 0 6px;font-family:'Anton',sans-serif;text-transform:uppercase;}
.newsletter p{margin:0;font-size:13px;max-width:360px;}
.nl-form{display:flex;gap:8px;}
.nl-form input{
  background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.25);
  color:var(--white);padding:12px 14px;border-radius:3px;min-width:240px;font-size:13px;
}
.footer-cols{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.footer-cols h5{color:var(--gold-light);font-size:12.5px;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 14px;}
.footer-cols a{display:block;color:rgba(255,255,255,0.7);font-size:13px;text-decoration:none;margin-bottom:10px;}
.footer-cols a:hover{color:var(--gold-light);}
.footer-bottom{
  margin-top:36px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.15);
  display:flex;justify-content:space-between;align-items:center;font-size:12px;flex-wrap:wrap;gap:10px;
}

.cart-overlay{position:fixed;inset:0;background:rgba(20,20,20,0.5);z-index:40;}
.cart-drawer{
  position:fixed;top:0;right:0;height:100%;width:400px;max-width:92vw;
  background:var(--cream);z-index:50;display:flex;flex-direction:column;
  box-shadow:-8px 0 24px rgba(0,0,0,0.2);
}
.cart-head{
  padding:20px;display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px solid var(--line);background:var(--white);
}
.cart-head h3{margin:0;font-family:'Anton',sans-serif;text-transform:uppercase;letter-spacing:0.03em;}
.cart-items{flex:1;overflow-y:auto;padding:16px 20px;}
.cart-line{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--line);}
.cart-line .thumb{
  width:60px;height:70px;background:var(--gold-pale);border-radius:4px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;color:var(--gold-deep);
}
.cart-line-info{flex:1;}
.cart-line-info .name{font-size:13.5px;font-weight:600;}
.cart-line-info .meta{font-size:11.5px;color:var(--ink-soft);margin:3px 0 8px;}
.qty-row{display:flex;align-items:center;gap:10px;}
.qty-row button{
  width:24px;height:24px;border:1px solid var(--line);background:#fff;border-radius:3px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
}
.qty-row .num{font-family:'JetBrains Mono',monospace;font-size:13px;min-width:16px;text-align:center;}
.remove-link{background:none;border:none;color:var(--error);font-size:11.5px;cursor:pointer;padding:0;text-decoration:underline;}
.cart-line-price{font-family:'JetBrains Mono',monospace;font-size:13.5px;font-weight:700;white-space:nowrap;}
.cart-empty{padding:60px 20px;text-align:center;color:var(--ink-soft);}
.cart-foot{padding:20px;border-top:1px solid var(--line);}
.subtotal-row{display:flex;justify-content:space-between;font-size:15px;margin-bottom:14px;}
.subtotal-row .amt{font-family:'JetBrains Mono',monospace;font-weight:700;}

.checkout-overlay{position:fixed;inset:0;background:rgba(20,20,20,0.6);z-index:60;display:flex;align-items:center;justify-content:center;padding:20px;}
.checkout-modal{
  background:var(--white);border-radius:8px;max-width:560px;width:100%;
  max-height:90vh;overflow-y:auto;
}
.checkout-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 24px;border-bottom:1px solid var(--line);
}
.checkout-head h3{margin:0;font-family:'Anton',sans-serif;text-transform:uppercase;font-size:18px;display:flex;align-items:center;gap:10px;}
.checkout-back{background:none;border:none;cursor:pointer;color:var(--ink);display:flex;align-items:center;gap:6px;font-size:13px;padding:0;}
.checkout-body{padding:24px;}
.checkout-steps{display:flex;gap:8px;margin-bottom:22px;}
.checkout-steps .step{
  flex:1;height:4px;border-radius:2px;background:var(--line);
}
.checkout-steps .step.done{background:var(--gold);}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.pay-method-row{display:flex;gap:10px;margin-bottom:20px;}
.pay-method{
  flex:1;border:1px solid var(--line);background:var(--white);border-radius:6px;
  padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:8px;
  cursor:pointer;font-size:12px;letter-spacing:0.02em;color:var(--ink-soft);
}
.pay-method.active{border-color:var(--gold);background:var(--gold-pale);color:var(--ink);font-weight:600;}
.bank-box{
  background:var(--gold-pale);border:1px solid var(--gold-light);border-radius:6px;
  padding:16px;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.9;margin-bottom:18px;
}
.bank-box b{color:var(--ink);}
.summary-box{
  background:var(--cream);border:1px solid var(--line);border-radius:6px;padding:16px;margin-bottom:20px;
}
.summary-line{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;}
.summary-line.total{font-weight:700;font-size:15px;border-top:1px solid var(--line);margin-top:6px;padding-top:10px;}
.secure-note{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ink-soft);justify-content:center;margin-top:14px;}
.success-box{text-align:center;padding:20px 0;}
.success-icon{
  width:64px;height:64px;border-radius:50%;background:var(--gold-pale);border:2px solid var(--gold);
  display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--gold-deep);
}
.success-box h3{font-family:'Anton',sans-serif;text-transform:uppercase;font-size:24px;margin:0 0 10px;}
.success-box p{color:var(--ink-soft);font-size:14px;margin:0 0 4px;}
.order-num{font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--ink);}

@media (max-width:920px){
  .tile-grid{grid-template-columns:1fr 1fr;}
  .product-grid{grid-template-columns:repeat(2,1fr);}
  .customizer{grid-template-columns:1fr;padding:26px;}
  .trust-strip{grid-template-columns:1fr;}
  .footer-cols{grid-template-columns:repeat(2,1fr);}
  .newsletter{flex-direction:column;align-items:flex-start;}
  .field-row{grid-template-columns:1fr;}
}
@media (max-width:560px){
  .product-grid{grid-template-columns:1fr;}
  .tile-grid{grid-template-columns:1fr;}
  .util-bar{display:none;}
  .pay-method-row{flex-direction:column;}
}
@media (prefers-reduced-motion: reduce){
  .tile, .btn{transition:none;}
}

.admin-overlay{position:fixed;inset:0;background:rgba(20,20,20,0.6);z-index:70;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;}
.admin-modal{background:var(--white);border-radius:8px;max-width:1100px;width:100%;margin:20px auto;}
.admin-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--line);}
.admin-head h3{margin:0;font-family:'Anton',sans-serif;text-transform:uppercase;font-size:18px;}
.admin-body{padding:24px;}
.admin-toolbar{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;align-items:center;}
.admin-toolbar .btn{font-size:12px;padding:10px 16px;}
.admin-table{width:100%;border-collapse:collapse;font-size:13px;}
.admin-table th{text-align:left;padding:8px 10px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-soft);border-bottom:2px solid var(--line);font-weight:600;}
.admin-table td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:middle;}
.admin-table input,.admin-table select{background:var(--white);border:1px solid var(--line);color:var(--ink);padding:7px 9px;border-radius:3px;font-size:12.5px;font-family:'Work Sans',sans-serif;width:100%;}
.admin-table input:focus,.admin-table select:focus{outline:2px solid var(--gold);outline-offset:1px;}
.admin-table input[type="number"]{width:100px;}
.admin-table .thumb-sm{width:40px;height:48px;border-radius:4px;object-fit:cover;background:var(--gold-pale);}
.admin-table .del-btn{background:none;border:none;color:var(--error);cursor:pointer;padding:4px;border-radius:4px;}
.admin-table .del-btn:hover{background:rgba(179,38,30,0.1);}
.admin-table tr:hover{background:var(--gold-pale);}
.admin-toast{position:fixed;bottom:24px;right:24px;background:var(--ink);color:var(--white);padding:12px 20px;border-radius:6px;font-size:13px;z-index:80;display:flex;align-items:center;gap:8px;animation:slideIn .2s ease;}
@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
`;

const LOGO_URL = "https://owinna.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkFtIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4d6f2d26151247cb834c9b4fb0e8090980d6f0ad/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2QzNKbGMybDZaVWtpQ2pVd2VEVXdCanNHVkE9PSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--ee0d9b7f003ac2f0a33df507257e34eadf0c414c/ekhaya.jpg";

function Sparkle({ size = 10, color = "var(--gold)" }) {
  return (
    <svg className="sparkle" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill={color} />
    </svg>
  );
}

function EkhayaCrest({ size = 44 }) {
  return (
    <img
      src={LOGO_URL}
      alt="Ekhaya FC"
      className="brand-logo"
      style={{ width: size, height: size, borderRadius: 8, objectFit: "cover" }}
    />
  );
}

const PRODUCTS = [
  { id: "m-home-jersey-player", name: "Home Jersey Player Edition", collection: "Kraal Kit Collection", price: 75000, gender: "men", category: "kits", badge: "NEW", customizable: true, image: "/images/home-jersey.png" },
  { id: "m-home-jersey-replica", name: "Home Jersey Replica", collection: "Kraal Kit Collection", price: 50000, gender: "men", category: "kits", customizable: true, image: "/images/home-jersey.png" },
  { id: "m-away-jersey", name: "Away Jersey 26/27", collection: "Highveld Away Collection", price: 75000, gender: "men", category: "kits", customizable: true, image: "/images/away-jersey.png" },
  { id: "m-third-jersey", name: "Third Jersey 26/27", collection: "Sunset Third Collection", price: 75000, gender: "men", category: "kits", badge: "NEW", customizable: true, image: "/images/third-jersey.png" },
  { id: "m-gold-jersey", name: "Gold Edition Jersey", collection: "Special Edition", price: 120000, gender: "men", category: "kits", badge: "NEW", customizable: true, image: "/images/third-gold.png" },
  { id: "m-tracksuit-v2", name: "Matchday Tracksuit", collection: "Home Ground Apparel", price: 120000, gender: "men", category: "apparel", image: "/images/tracksuit.png" },
  { id: "m-hoodie", name: "Ekhaya Hoodie", collection: "Home Ground Apparel", price: 150000, gender: "men", category: "apparel" },
  { id: "m-polo", name: "Men's Club Polo", collection: "Home Ground Apparel", price: 69900, gender: "men", category: "apparel" },
  { id: "w-home-jersey-player", name: "Women's Home Jersey Player Edition", collection: "Kraal Kit Collection", price: 75000, gender: "women", category: "kits", badge: "NEW", customizable: true, image: "/images/home-jersey.png" },
  { id: "w-home-jersey-replica", name: "Women's Home Jersey Replica", collection: "Kraal Kit Collection", price: 50000, gender: "women", category: "kits", customizable: true, image: "/images/home-jersey.png" },
  { id: "w-away-jersey", name: "Women's Away Jersey 26/27", collection: "Highveld Away Collection", price: 75000, gender: "women", category: "kits", customizable: true, image: "/images/away-jersey.png" },
  { id: "w-third-jersey", name: "Women's Third Jersey 26/27", collection: "Sunset Third Collection", price: 75000, gender: "women", category: "kits", badge: "NEW", customizable: true, image: "/images/third-jersey.png" },
  { id: "w-gold-jersey", name: "Women's Gold Edition Jersey", collection: "Special Edition", price: 120000, gender: "women", category: "kits", badge: "NEW", customizable: true, image: "/images/third-gold.png" },
  { id: "w-tracksuit-v2", name: "Women's Matchday Tracksuit", collection: "Home Ground Apparel", price: 120000, gender: "women", category: "apparel", image: "/images/tracksuit.png" },
  { id: "w-hoodie", name: "Women's Ekhaya Hoodie", collection: "Home Ground Apparel", price: 150000, gender: "women", category: "apparel" },
  { id: "w-polo", name: "Women's Club Polo", collection: "Home Ground Apparel", price: 69900, gender: "women", category: "apparel" },
  { id: "u-scarf", name: "Ekhaya Scarf", collection: "Terrace Collection", price: 29900, gender: "unisex", category: "accessories" },
  { id: "u-cap", name: "Gold Crest Cap", collection: "Terrace Collection", price: 25000, gender: "unisex", category: "accessories" },
  { id: "u-bag", name: "Home Ground Duffel", collection: "Terrace Collection", price: 64900, gender: "unisex", category: "accessories" },
];

const STORAGE_KEY = "ekhaya_products_v1";

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function resetProducts() {
  localStorage.removeItem(STORAGE_KEY);
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "kits", label: "Kits" },
  { id: "apparel", label: "Apparel" },
  { id: "accessories", label: "Accessories" },
];

const TILES = [
  { label: "Kits", sub: "Home \u00b7 Away \u00b7 Third", cat: "kits" },
  { label: "Apparel", sub: "Off-pitch essentials", cat: "apparel" },
  { label: "Accessories", sub: "Scarves, caps & bags", cat: "accessories" },
];

const SIZES = ["S", "M", "L", "XL"];

function ProductCard({ product, onAdd }) {
  const [size, setSize] = useState("M");
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card">
      <div className="card-media">
        {product.badge && (
          <span className={`badge ${product.badge === "NEW" ? "new" : ""}`}>{product.badge}</span>
        )}
        <button
          className={`wish-btn ${wished ? "active" : ""}`}
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={15} fill={wished ? "currentColor" : "none"} />
        </button>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
        ) : (
          <Shirt size={64} strokeWidth={1.1} />
        )}
      </div>
      <div className="card-body">
        <div>
          <div className="card-collection">{product.collection}</div>
          <div className="card-title">{product.name}</div>
        </div>
        <div className="size-row">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`size-chip ${size === s ? "active" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="card-price">K{product.price.toLocaleString()}</div>
        <button className={`add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? <><Check size={14} /> Added to bag</> : <><ShoppingBag size={14} /> Add to bag</>}
        </button>
      </div>
    </div>
  );
}

function CheckoutModal({ cart, subtotal, onClose, onComplete }) {
  const [step, setStep] = useState("details");
  const [method, setMethod] = useState("airtel");
  const [orderNum, setOrderNum] = useState("");
  const [details, setDetails] = useState({ name: "", phone: "", address: "", city: "" });
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const total = subtotal;

  const validateDetails = () => {
    const e = {};
    if (!details.name.trim()) e.name = "Enter your full name";
    if (!/^\d{9,10}$/.test(details.phone.replace(/\D/g, ""))) e.phone = "Enter a valid phone number";
    if (!details.address.trim()) e.address = "Enter your delivery address";
    if (!details.city.trim()) e.city = "Enter your city";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (method !== "bank") {
      if (!/^\d{9,10}$/.test(phone.replace(/\D/g, ""))) e.phone = "Enter a valid phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDetailsNext = () => {
    if (validateDetails()) {
      setErrors({});
      setStep("payment");
    }
  };

  const handlePay = () => {
    if (validatePayment()) {
      const num = "EKH-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNum(num);
      setErrors({});
      setStep("success");
    }
  };

  return (
    <div className="checkout-overlay" onClick={(e) => e.target === e.currentTarget && step !== "success" && onClose()}>
      <div className="checkout-modal">
        <div className="checkout-head">
          {step === "payment" ? (
            <button className="checkout-back" onClick={() => setStep("details")}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <h3>{step === "success" ? "Order confirmed" : "Checkout"}</h3>
          )}
          {step === "payment" && <h3 style={{ margin: 0 }}>Payment</h3>}
          {step !== "success" && (
            <button className="icon-btn" onClick={onClose} aria-label="Close checkout"><X size={20} /></button>
          )}
        </div>

        <div className="checkout-body">
          {step !== "success" && (
            <div className="checkout-steps">
              <div className={`step ${step === "details" || step === "payment" ? "done" : ""}`} />
              <div className={`step ${step === "payment" ? "done" : ""}`} />
            </div>
          )}

          {step === "details" && (
            <>
              <div className="field">
                <label>Full name</label>
                <input
                  className={errors.name ? "err" : ""}
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  placeholder="Thandiwe Mabaso"
                />
                {errors.name && <span className="err-msg">{errors.name}</span>}
              </div>
              <div className="field">
                <label>Phone number</label>
                <input
                  className={errors.phone ? "err" : ""}
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value.replace(/[^\d\s+]/g, "") })}
                  placeholder="0991 234 567"
                  inputMode="tel"
                />
                {errors.phone && <span className="err-msg">{errors.phone}</span>}
              </div>
              <div className="field">
                <label>Delivery address</label>
                <input
                  className={errors.address ? "err" : ""}
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  placeholder="12 Kanjedza Road"
                />
                {errors.address && <span className="err-msg">{errors.address}</span>}
              </div>
              <div className="field">
                <label>City / Area</label>
                <input
                  className={errors.city ? "err" : ""}
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  placeholder="Lilongwe"
                />
                {errors.city && <span className="err-msg">{errors.city}</span>}
              </div>
              <button className="btn btn-ink" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={handleDetailsNext}>
                Continue to payment <ChevronRight size={16} />
              </button>
            </>
          )}

          {step === "payment" && (
            <>
              <div className="pay-method-row">
                <button className={`pay-method ${method === "airtel" ? "active" : ""}`} onClick={() => setMethod("airtel")}>
                  <img src="/images/airtel-logo.svg" alt="Airtel" style={{ height: 28, borderRadius: 4 }} />
                </button>
                <button className={`pay-method ${method === "bank" ? "active" : ""}`} onClick={() => setMethod("bank")}>
                  <img src="/images/fdh-logo.svg" alt="FDH Bank" style={{ height: 28, borderRadius: 4 }} />
                  <img src="/images/nb-logo.svg" alt="National Bank" style={{ height: 28, borderRadius: 4 }} />
                </button>
              </div>

              {method !== "bank" && (
                <div className="field">
                  <label>Airtel Money number</label>
                  <input
                    className={errors.phone ? "err" : ""}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d\s+]/g, ""))}
                    placeholder="0991 234 567"
                    inputMode="tel"
                  />
                  {errors.phone && <span className="err-msg">{errors.phone}</span>}
                </div>
              )}

              {method === "airtel" && (
                <div className="bank-box" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.25)" }}>
                  <div><b>Send payment to:</b></div>
                  <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, margin: "6px 0", color: "var(--ink)" }}>10080128</div>
                  <div><b>Name:</b> Ekhaya FC Store</div>
                  <div style={{ marginTop: 6, fontSize: 12 }}>Use your order number as reference</div>
                </div>
              )}

              {method === "bank" && (
                <div className="bank-box">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <img src="/images/fdh-logo.svg" alt="FDH" style={{ height: 30, borderRadius: 4 }} />
                  </div>
                  <div><b>Account name:</b> Ekhaya FC Store</div>
                  <div><b>Account number:</b> <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>1910000195208</span></div>
                  <div><b>Branch:</b> Lilongwe</div>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                    <img src="/images/nb-logo.svg" alt="National Bank" style={{ height: 30, borderRadius: 4 }} />
                  </div>
                  <div style={{ marginTop: 6 }}><b>Account name:</b> Ekhaya FC Store</div>
                  <div><b>Account number:</b> <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>1004127133</span></div>
                  <div style={{ marginTop: 8 }}><b>Reference:</b> Your order number will be sent via SMS</div>
                </div>
              )}

              <div className="summary-box">
                <div className="summary-line"><span>Subtotal</span><span className="mono">K{subtotal.toLocaleString()}</span></div>
                <div className="summary-line total"><span>Total</span><span className="mono">K{total.toLocaleString()}</span></div>
              </div>

              <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} onClick={handlePay}>
                {method === "bank" ? "Confirm order" : `Pay K${total.toLocaleString()}`}
              </button>
              <div className="secure-note"><Lock size={12} /> Payments are simulated for this demo store</div>
            </>
          )}

          {step === "success" && (
            <div className="success-box">
              <div className="success-icon"><Check size={30} /></div>
              <h3>Thanks, {details.name.split(" ")[0] || "fan"}!</h3>
              <p>Your order <span className="order-num">{orderNum}</span> is confirmed.</p>
              <p>We'll SMS you at {details.phone} with updates.</p>
              <button
                className="btn btn-ink"
                style={{ marginTop: 22, justifyContent: "center", width: "100%" }}
                onClick={() => onComplete(orderNum)}
              >
                Continue shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onClose, onSave }) {
  const [products, setProducts] = useState(() => {
    const loaded = loadProducts();
    return loaded ? loaded.map(p => ({ ...p })) : PRODUCTS.map(p => ({ ...p }));
  });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const update = (idx, field, value) => {
    setProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const save = () => {
    saveProducts(products);
    onSave(products);
    showToast("Products saved");
  };

  const remove = (idx) => {
    setProducts(prev => prev.filter((_, i) => i !== idx));
  };

  const addProduct = () => {
    const newId = "new-" + Date.now();
    setProducts(prev => [...prev, {
      id: newId, name: "New Product", collection: "Collection", price: 50000,
      gender: "men", category: "kits", image: "", customizable: false, badge: "",
    }]);
  };

  const resetAll = () => {
    resetProducts();
    const fresh = PRODUCTS.map(p => ({ ...p }));
    setProducts(fresh);
    onSave(fresh);
    showToast("Reset to defaults");
  };

  const handleImageUpload = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => update(idx, "image", e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal">
        <div className="admin-head">
          <h3>Admin Panel</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close admin"><X size={20} /></button>
        </div>
        <div className="admin-body">
          <div className="admin-toolbar">
            <button className="btn btn-ink" onClick={save}>Save changes</button>
            <button className="btn btn-gold" onClick={addProduct}>+ Add product</button>
            <button className="btn" onClick={resetAll} style={{ border: "1px solid var(--line)" }}>Reset to defaults</button>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-soft)" }}>{products.length} products</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Collection</th>
                  <th>Price (K)</th>
                  <th>Gender</th>
                  <th>Category</th>
                  <th>Badge</th>
                  <th>Customizable</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id}>
                    <td>
                      {p.image ? <img src={p.image} className="thumb-sm" alt="" /> : null}
                      <label style={{ display: "block", fontSize: 10, marginTop: 3, cursor: "pointer", color: "var(--gold)" }}>
                        <Upload size={10} /> upload
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(idx, e.target.files[0])} />
                      </label>
                    </td>
                    <td><input value={p.name} onChange={(e) => update(idx, "name", e.target.value)} /></td>
                    <td><input value={p.collection} onChange={(e) => update(idx, "collection", e.target.value)} /></td>
                    <td><input type="number" value={p.price} onChange={(e) => update(idx, "price", Number(e.target.value))} /></td>
                    <td>
                      <select value={p.gender} onChange={(e) => update(idx, "gender", e.target.value)}>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </td>
                    <td>
                      <select value={p.category} onChange={(e) => update(idx, "category", e.target.value)}>
                        <option value="kits">Kits</option>
                        <option value="apparel">Apparel</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </td>
                    <td><input value={p.badge || ""} onChange={(e) => update(idx, "badge", e.target.value)} placeholder="-" style={{ width: 60 }} /></td>
                    <td>
                      <select value={p.customizable ? "yes" : "no"} onChange={(e) => update(idx, "customizable", e.target.value === "yes")}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td>
                      <button className="del-btn" onClick={() => remove(idx)} aria-label="Delete product"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {toast && <div className="admin-toast"><Check size={14} /> {toast}</div>}
    </div>
  );
}

export default function EkhayaStore() {
  const [products, setProducts] = useState(() => loadProducts() || PRODUCTS);
  const [adminOpen, setAdminOpen] = useState(false);
  const [gender, setGender] = useState("men");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [custKit, setCustKit] = useState("Home");
  const [custName, setCustName] = useState("");
  const [custNumber, setCustNumber] = useState("");
  const [custVariant, setCustVariant] = useState("Men");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const genderMatch = p.gender === gender || p.gender === "unisex";
      const catMatch = category === "all" || p.category === category;
      return genderMatch && catMatch;
    });
  }, [gender, category, products]);

  const bestSellers = useMemo(
    () => products.filter((p) => (p.gender === gender || p.gender === "unisex") && p.customizable).slice(0, 4),
    [gender, products]
  );

  const addToCart = (product, size) => {
    setCart((prev) => {
      const key = `${product.id}-${size}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { key, product, size, qty: 1 }];
    });
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const custPrice = 75000 + (custName || custNumber ? 5000 : 0);

  return (
    <div className="ekhaya">
      <style>{CSS}</style>

      <div className="util-bar">

        <span>Help &nbsp;\u00b7&nbsp; Track order &nbsp;\u00b7&nbsp; MWK</span>
      </div>

      <nav className="main-nav">
        <div className="brand">
          <EkhayaCrest size={44} />
          <div className="brand-word">EKHAYA FC<span>Official store</span></div>
        </div>

        <div className="gender-toggle" role="tablist" aria-label="Shop by">
          <button role="tab" aria-selected={gender === "men"} className={gender === "men" ? "active" : ""} onClick={() => setGender("men")}>Men</button>
          <button role="tab" aria-selected={gender === "women"} className={gender === "women" ? "active" : ""} onClick={() => setGender("women")}>Women</button>
        </div>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Search"><Search size={19} /></button>
          <button className="icon-btn" aria-label="Wishlist"><Heart size={19} /></button>
          <button className="icon-btn" aria-label="Admin panel" onClick={() => setAdminOpen(true)} style={{ opacity: 0.35 }}><Settings size={19} /></button>
          <button className="icon-btn" aria-label="Open bag" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className="icon-btn" aria-label="Menu"><Menu size={19} /></button>
        </div>
      </nav>

      <div className="category-strip">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={category === c.id ? "active" : ""} onClick={() => setCategory(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <header className="hero">
        <div className="hero-badge-watermark">
          <img src={LOGO_URL} alt="" style={{ width: 420, height: 420, objectFit: "contain" }} />
        </div>
        <div className="hero-inner">
          <div className="hero-eyebrow"><Sparkle /> 26/27 Season \u00b7 New kits in</div>
          <h1 className="display">This is home.<br />This is Ekhaya FC.</h1>
          <p>
            Every kit is built for the people who never miss a matchday \u2014 at the ground
            or on the street outside it. Shop the new home, away and third kits, now live
            for men and women.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-gold" onClick={() => { setGender("men"); setCategory("kits"); }}>
              Shop men's kits <ChevronRight size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => { setGender("women"); setCategory("kits"); }}>
              Shop women's kits <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow"><Sparkle size={9} /> Shop by category</p>
            <h2 className="display">Find your kit</h2>
          </div>
        </div>
        <div className="tile-grid">
          {TILES.map((t) => (
            <button key={t.cat} className="tile" onClick={() => setCategory(t.cat)}>
              <Shirt size={26} color="#B9922E" />
              <div>
                <div className="tile-label display">{t.label}</div>
                <div className="tile-sub">{t.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <p className="eyebrow"><Sparkle size={9} /> {gender === "men" ? "Men" : "Women"} \u00b7 {CATEGORIES.find((c) => c.id === category).label}</p>
            <h2 className="display">{filtered.length} products</h2>
          </div>
          {category !== "all" && (
            <button className="view-all" onClick={() => setCategory("all")}>View all <ChevronRight size={14} /></button>
          )}
        </div>
        <div className="product-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <p className="eyebrow"><Sparkle size={9} /> Make it yours</p>
            <h2 className="display">Customise your jersey</h2>
          </div>
        </div>
        <div className="customizer">
          <div>
            <div className="field">
              <label>Kit</label>
              <div className="kit-choice-row">
                {["Home", "Away", "Third"].map((k) => (
                  <button key={k} className={custKit === k ? "active" : ""} onClick={() => setCustKit(k)}>{k}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Fit</label>
              <div className="kit-choice-row">
                {["Men", "Women"].map((v) => (
                  <button key={v} className={custVariant === v ? "active" : ""} onClick={() => setCustVariant(v)}>{v}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Name on back (optional)</label>
              <input placeholder="e.g. MABASO" maxLength={12} value={custName} onChange={(e) => setCustName(e.target.value.toUpperCase())} />
            </div>
            <div className="field">
              <label>Number (optional)</label>
              <input placeholder="e.g. 10" maxLength={2} value={custNumber} onChange={(e) => setCustNumber(e.target.value.replace(/\D/g, ""))} />
            </div>
            <button
              className="btn btn-gold"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() =>
                addToCart(
                  {
                    id: `custom-${custKit.toLowerCase()}`,
                    name: `${custKit} Jersey${custName ? " \u2014 " + custName : ""}${custNumber ? " #" + custNumber : ""}`,
                    collection: `${custVariant}'s Custom Kit`,
                    price: custPrice,
                  },
                  "M"
                )
              }
            >
              Add to bag \u2014 K{custPrice.toLocaleString()} <ShoppingBag size={16} />
            </button>
          </div>
          <div className="jersey-preview">
            <Shirt size={110} strokeWidth={0.9} color="#141414" />
            {custName && <div className="jersey-name">{custName}</div>}
            {custNumber && <div className="jersey-number">{custNumber}</div>}
            {!custName && !custNumber && (
              <div style={{ color: "#a8a49a", fontSize: 13 }}>Your name and number preview here</div>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <p className="eyebrow"><Sparkle size={9} /> Fan favourites</p>
            <h2 className="display">Best sellers</h2>
          </div>
        </div>
        <div className="product-grid">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="newsletter">
            <div>
              <h3>Join the terrace</h3>
              <p>New kits, restocks and matchday drops \u2014 straight to your inbox.</p>
            </div>
            <div className="nl-form">
              <input type="email" placeholder="Email address" />
              <button className="btn btn-gold">Sign up</button>
            </div>
          </div>
          <div className="footer-cols">
            <div>
              <h5>Shop</h5>
              <a href="#">Men</a><a href="#">Women</a><a href="#">Kits</a><a href="#">Accessories</a>
            </div>
            <div>
              <h5>Help</h5>
              <a href="#">Returns</a><a href="#">Contact us</a>
            </div>
            <div>
              <h5>Contact</h5>
              <a href="tel:+265892308718">+265 892 30 87 18</a>
              <a href="tel:+26588740311">+265 887 403 11</a>
            </div>
            <div>
              <h5>Legal</h5>
              <a href="#">Privacy policy</a>
              <a href="#">Terms of purchase</a>
              <a href="#">Refund policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>\u00a9 2026 Ekhaya FC Official Store. All rights reserved.</span>
            <span>Ekhaya FC is a registered football club in Malawi. All merchandise is official club-licensed product. Prices in Malawian Kwacha (MWK). Payments processed via Airtel Money, TNM Mpamba, FDH Bank, and National Bank of Malawi.</span>
          </div>
        </div>
      </footer>

      {cartOpen && !checkoutOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-head">
              <h3>Your bag ({cartCount})</h3>
              <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">Your bag is empty. Time to kit up.</div>
              ) : (
                cart.map((item) => (
                  <div className="cart-line" key={item.key}>
                    <div className="thumb"><Shirt size={26} /></div>
                    <div className="cart-line-info">
                      <div className="name">{item.product.name}</div>
                      <div className="meta">Size {item.size} \u00b7 {item.product.collection}</div>
                      <div className="qty-row">
                        <button onClick={() => updateQty(item.key, -1)} aria-label="Decrease quantity"><Minus size={12} /></button>
                        <span className="num">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} aria-label="Increase quantity"><Plus size={12} /></button>
                        <button className="remove-link" onClick={() => removeItem(item.key)}>Remove</button>
                      </div>
                    </div>
                    <div className="cart-line-price">K{(item.product.price * item.qty).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-foot">
                <div className="subtotal-row"><span>Subtotal</span><span className="amt">K{subtotal.toLocaleString()}</span></div>
                <button className="btn btn-ink" style={{ width: "100%", justifyContent: "center" }} onClick={() => setCheckoutOpen(true)}>
                  Checkout <Lock size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          onClose={() => setCheckoutOpen(false)}
          onComplete={() => {
            setCart([]);
            setCheckoutOpen(false);
            setCartOpen(false);
          }}
        />
      )}

      {adminOpen && (
        <AdminPanel
          onClose={() => setAdminOpen(false)}
          onSave={(updated) => setProducts(updated)}
        />
      )}
    </div>
  );
}

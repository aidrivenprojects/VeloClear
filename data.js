// VeloClear Data Layer — loads first, defines all data before any function

const DB = {
  risks:[
    {id:'R001',desc:'Third-party API vendor may fail to deliver integration module on schedule, causing mobile app launch delay',cat:'External',prob:3,impact:5,score:15,trigger:'Vendor misses Sprint 2 milestone delivery (due 20 Jan)',response:'Mitigate',owner:'Alex',status:'TRIGGERED',mitigation:'Build internal API wrapper in parallel from Sprint 1. Reduces impact from 5 to 2.',contingency:'Activate wrapper immediately. Brief steering within 24hrs. Escalate to vendor account director.'},
    {id:'R002',desc:'Key developer may resign mid-project due to competing market offers',cat:'People',prob:2,impact:4,score:8,trigger:'Developer submits resignation or gives notice',response:'Mitigate',owner:'Tech Lead',status:'Open',mitigation:'Document all code daily. Cross-train second developer. Raise retention concern with HR.',contingency:'Activate contractor immediately. 2-week handover period mandatory.'},
    {id:'R003',desc:'Client may request significant scope additions beyond agreed WBS requirements',cat:'Commercial',prob:3,impact:3,score:9,trigger:'Client raises any requirement not in agreed WBS',response:'Mitigate',owner:'Alex',status:'Open',mitigation:'Strict change control process documented and agreed with client at initiation.',contingency:'Raise CR within 1 hour. Impact assessment within 48 hours. Zero work starts before CCB approval.'}
  ],
  assumptions:[
    {id:'A001',desc:'Compliance team will review and approve each content module within 5 working days',wrong:'Becomes schedule risk — at NX actual cycle was 12 days, causing timeline pressure',owner:'Alex',date:'2024-02-01',method:'Written confirmation from Compliance Director in kick-off meeting',status:'Confirmed True'},
    {id:'A002',desc:'Client will provide access to UAT test environment by Sprint 1 Day 3',wrong:'Sprint 1 testing cannot proceed — blocks delivery by up to 2 sprints',owner:'BA Lead',date:'2024-01-20',method:'Written confirmation from client IT team',status:'Unvalidated'}
  ],
  issues:[
    {id:'I001',desc:'Vendor API delivery missed Sprint 2 milestone. Vendor has not responded to 3 follow-up messages over 2 days.',source:'R001 — Vendor API risk trigger fired',impact:'Mobile app integration cannot proceed. Risk to go-live date.',owner:'Alex',opened:'2024-01-18',targetClose:'2024-01-20',actions:'Activated internal wrapper. Briefed sponsor. Escalating to vendor account director.',stage:2,status:'In Progress'}
  ],
  dependencies:[
    {id:'D001',desc:'REST API documentation and sandbox environment from vendor',team:'TechBridge Systems',owner:'Alex',requiredBy:'2024-01-15',risk:'High — project stops',status:'Blocked'},
    {id:'D002',desc:'Client test data extract for UAT phase',team:'Client IT Team',owner:'BA Lead',requiredBy:'2024-02-01',risk:'Medium — delay likely',status:'On Track'}
  ],
  stakeholders:[
    {id:'S001',name:'Jordan Chen',role:'CTO / Sponsor',org:'Apex Solutions Ltd',contact:'jchen@apexsolutions.com',power:5,interest:4,current:'Supportive',target:'Supportive',freq:'Weekly',chan:'Email + Dashboard',concerns:'Project delivers on time within budget',action:'Weekly status email with EVM numbers every Monday 9am'},
    {id:'S002',name:'Compliance Director',role:'Head of Compliance',org:'Nexus Financial Services',contact:'compliance@nexusfinancial.com',power:4,interest:5,current:'Neutral',target:'Supportive',freq:'Fortnightly',chan:'Formal report',concerns:'Regulatory accuracy, review timeline not compressed',action:'Share content 1 week before review deadline. Include QA checklist showing regulatory accuracy.'},
    {id:'S003',name:'Branch Managers (12)',role:'Sales Branch Managers',org:'Pinnacle Finance Group',contact:'bm-group@pinnacle.com',power:2,interest:5,current:'Resistant',target:'Neutral',freq:'Weekly',chan:'Meeting',concerns:'Training takes them off client-facing work on Monday mornings',action:'Move sessions to Friday PM. Cut to 90min. Add peer discussion. 1-to-1 with most resistant manager this week.'}
  ],
  crs:[
    {id:'CR-001',desc:'Add real-time push notification module to mobile app. Client stakeholder spoke directly to developer.',by:'Client Stakeholder',date:'2024-01-17',cat:'Scope Addition',pri:'Normal',scope:'New module not in WBS. Requires push notification API and device registration service.',sched:10,cost:250000,qual:'Moderate — test plan revision required',rec:'Approve with budget and timeline adjustment',status:'Pending CCB — 52hrs overdue',decision:''},
    {id:'CR-002',desc:'Change training session language from English to bilingual English-Tamil for branch manager cohort.',by:'Training Manager',date:'2024-01-19',cat:'Scope Addition',pri:'High',scope:'Bilingual materials for all 6 modules.',sched:5,cost:80000,qual:'Minor — additional review pass needed',rec:'Approve with adjusted timeline',status:'Pending CCB',decision:''}
  ],
  comms:[
    {id:'C001',what:'Weekly Project Status Report',who:'CTO + Steering Committee',how:'Email',when:'Weekly',owner:'Alex',next:'2024-01-22',status:'On Track'},
    {id:'C002',what:'Fortnightly Steering Committee Pack (RAG + EVM)',who:'Full Steering Committee',how:'Formal report + Meeting',when:'Fortnightly',owner:'Alex',next:'2024-01-26',status:'On Track'},
    {id:'C003',what:'Daily Sprint Stand-up Summary',who:'Tech Lead + Dev Team',how:'Messaging app',when:'Daily',owner:'Tech Lead',next:'2024-01-20',status:'Overdue'}
  ],
  audit:[
    {ts:'2024-01-18 09:14',user:'Alex',mod:'RAID',action:'R001 status → TRIGGERED (vendor missed Sprint 2 milestone)',detail:''},
    {ts:'2024-01-18 09:22',user:'Alex',mod:'Issues',action:'I001 logged — Vendor API delivery failure',detail:'Stage 1 escalation started. 48hr timer running.'},
    {ts:'2024-01-17 14:33',user:'Alex',mod:'Change Control',action:'CR-001 raised — Notification module scope addition',detail:'₹2.5L cost impact. 10-day schedule impact.'},
    {ts:'2024-01-17 16:01',user:'System',mod:'Automation',action:'CR-001 auto-escalation: 52hrs without CCB decision',detail:'Auto-reminder sent to CCB Chair.'},
    {ts:'2024-01-19 10:00',user:'Alex',mod:'Change Control',action:'CR-002 raised — Bilingual training materials',detail:'₹80K cost impact. 5-day schedule impact.'}
  ],
  rag:{
    scope:{status:'green',auto:false,commentary:'All deliverables within agreed scope. CR-001 pending CCB — no unapproved scope changes implemented.'},
    schedule:{status:'amber',auto:true,commentary:'SPI 0.97 — minor lag. Sprint 3 burn-down flat on Day 4, escalated same morning, recovered 6 of 8 blocked points. Recovery plan active.'},
    cost:{status:'green',auto:true,commentary:'CPI 1.08 — delivering 8% more value per rupee. EAC ₹27.8L vs ₹30L baseline. ₹2.2L favourable. Decision for steering: bank saving or invest in tech debt?'},
    quality:{status:'green',auto:false,commentary:'Definition of Done enforced every increment. Zero critical defects open. UAT plan on track.'},
    risk:{status:'red',auto:true,commentary:'R001 trigger fired — vendor API delivery failure. Internal wrapper activated. Steering briefed. 3-day delay projected. I001 in Stage 2 escalation.'},
    resources:{status:'green',auto:false,commentary:'Team at full capacity. No unplanned attrition. Vendor on plan for remaining deliverables post-wrapper activation.'},
    stakeholders:{status:'amber',auto:false,commentary:'Branch managers (Pinnacle) currently Resistant. Target Neutral. Action plan active — Friday PM sessions, 90min format, peer discussion added.'}
  },
  escalations:[
    {id:'ESC-001',issue:'I001 — Vendor API delivery failure',stages:[
      {n:1,label:'PM Resolves',status:'done',date:'2024-01-18 09:22',owner:'Alex',action:'Activated internal wrapper. Contacted vendor project contact ×3. No response.'},
      {n:2,label:'PM + Sponsor',status:'active',date:'2024-01-18 14:00',owner:'Alex + Jordan Chen',action:'Briefed sponsor. Escalating to vendor account director. Expected response by 20 Jan EOD.'},
      {n:3,label:'Steering Committee',status:'pending',date:'',owner:'',action:'If no vendor response by 20 Jan, raise at next steering meeting 22 Jan.'},
      {n:4,label:'Executive Sponsor',status:'pending',date:'',owner:'',action:''}
    ]},
    {id:'ESC-002',issue:'CR-001 — CCB decision overdue (52hrs)',stages:[
      {n:1,label:'PM Raises CR',status:'done',date:'2024-01-17 14:33',owner:'Alex',action:'CR-001 raised. Impact assessment submitted to CCB within 1 hour.'},
      {n:2,label:'Auto-reminder sent',status:'active',date:'2024-01-19 14:33',owner:'System',action:'CCB has been waiting 52 hours. Auto-reminder sent to CCB Chair. Decision required.'},
      {n:3,label:'Steering Committee',status:'pending',date:'',owner:'',action:'If no CCB decision by 20 Jan, escalate to Steering.'},
      {n:4,label:'',status:'pending',date:'',owner:'',action:''}
    ]}
  ],
  decisions:[
    {type:'Budget Change',desc:'Any increase or decrease to project budget',pm:'≤ 5% of BAC',sponsor:'5–15% of BAC',steering:'> 15% or any scope change',resp:'48hrs / 72hrs / Next meeting'},
    {type:'Schedule Change',desc:'Changes to agreed milestone or go-live dates',pm:'≤ 3 days slip',sponsor:'3–10 days slip',steering:'> 10 days or go-live change',resp:'24hrs / 48hrs / Next meeting'},
    {type:'Scope Change',desc:'Any addition or removal from agreed WBS',pm:'None — all scope to CCB',sponsor:'Minor clarifications only',steering:'All scope changes require CCB',resp:'48hr CCB decision target'},
    {type:'Resource Change',desc:'Team composition, vendor changes, new hires',pm:'Same-skill contractors',sponsor:'New team member, budget impact',steering:'Key vendor replacement',resp:'48hrs / 72hrs / Next meeting'},
    {type:'Risk Response',desc:'Activating mitigation or contingency plans',pm:'Pre-approved in RAID log',sponsor:'Unplanned mitigations ≤ ₹1L',steering:'Unplanned mitigations > ₹1L',resp:'Immediate / 24hrs / 48hrs'}
  ],
  raciTasks:['Project Charter','RAID Log Maintenance','Sprint Planning','Sprint Review','Stakeholder Communications','Change Control Process','Steering Committee Report','Quality Assurance'],
  raciRoles:['PM (Alex)','Tech Lead','BA Lead','QA Lead','Sponsor'],
  raciMatrix:[['A','C','C','C','I'],['A','R','C','I','I'],['C','A','R','C','I'],['C','A','C','R','I'],['A','R','R','I','I'],['A','C','C','I','C'],['A','R','C','C','I'],['C','C','C','A','I']]
}

DB.sprints = [
  {id:'S1',name:'Sprint 1 — Foundation',goal:'Set up CI/CD, build API wrapper skeleton, configure dev environment',start:'2024-01-02',end:'2024-01-15',capacity:40,days:14,status:'Closed',velocity:38},
  {id:'S2',name:'Sprint 2 — Core Integration',goal:'Complete API wrapper, vendor integration, basic auth flow',start:'2024-01-16',end:'2024-01-29',capacity:42,days:14,status:'Closed',velocity:36},
  {id:'S3',name:'Sprint 3 — Mobile App Integration',goal:'Complete vendor API wrapper and unit tests. Resolve blocker on push notification dependency.',start:'2024-01-30',end:'2024-02-12',capacity:42,days:14,status:'Active',velocity:null}
];

DB.sprintIntelligence = {
  P001: [
    {id:'SI-P001-S1',sprintId:'S1',projectId:'P001',name:'Sprint 1 — Foundation',
     committed:40,completed:38,velocity:38,
     ragAtClose:'green',
     blockers:[],
     keyDecisions:['API wrapper architecture approved','CI/CD pipeline established'],
     retroSummary:'Strong start. Environment ready on Day 1. Team velocity higher than baseline.',
     retroActions:[{text:'Add code review to DoD',owner:'TM004',status:'Done'}],
     delayTraceIds:[]},
    {id:'SI-P001-S2',sprintId:'S2',projectId:'P001',name:'Sprint 2 — Core Integration',
     committed:42,completed:36,velocity:36,
     ragAtClose:'amber',
     blockers:['Vendor API documentation incomplete — 3 endpoints missing'],
     keyDecisions:['Wrapper scope extended to cover missing endpoints','Sprint 3 capacity adjusted'],
     retroSummary:'Vendor documentation gaps caused mid-sprint replanning. Team adapted well.',
     retroActions:[
       {text:'Request full API spec before sprint planning',owner:'TM001',status:'Done'},
       {text:'WIP limit 2 per person in review column',owner:'TM019',status:'Done'}
     ],
     delayTraceIds:[]},
    {id:'SI-P001-S3',sprintId:'S3',projectId:'P001',name:'Sprint 3 — Mobile Integration',
     committed:42,completed:null,velocity:null,
     ragAtClose:'in-progress',
     blockers:['D001 — Vendor sandbox not delivered (ACTIVE — Stage 2 escalation)'],
     keyDecisions:['Wrapper activated as primary path','3-day slip accepted and baselined'],
     retroSummary:'In progress',
     retroActions:[],
     delayTraceIds:['DT001']}
  ],
  P002: [
    {id:'SI-P002-S1',sprintId:'S1',projectId:'P002',name:'Sprint 1 — Portal Foundation',committed:38,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Framework selected — React + Django'],retroSummary:'Overdelivered. Team found 2 points of refactoring they completed ahead of schedule.',retroActions:[{text:'Add tech debt register',owner:'TM016',status:'Done'}],delayTraceIds:[]},
    {id:'SI-P002-S2',sprintId:'S2',projectId:'P002',name:'Sprint 2 — Auth & Roles',committed:40,completed:38,velocity:38,ragAtClose:'green',blockers:['Minor: Compliance review took 3 extra days'],keyDecisions:['Parallel compliance track established'],retroSummary:'Minor compliance delay managed well. Parallel tracking works.',retroActions:[{text:'5-day review buffer in Sprint Planning',owner:'TM001',status:'Done'}],delayTraceIds:[]},
    {id:'SI-P002-S3',sprintId:'S3',projectId:'P002',name:'Sprint 3 — Assessment Engine',committed:42,completed:44,velocity:44,ragAtClose:'green',blockers:[],keyDecisions:['Engine scope extended — extra capacity used for stretch goals'],retroSummary:'Best sprint to date. Stretch goals achieved. Morale high.',retroActions:[{text:'Document stretch goal process for future sprints',owner:'TM015',status:'Open'}],delayTraceIds:[]},
    {id:'SI-P002-S4',sprintId:'S4',projectId:'P002',name:'Sprint 4 — Compliance Module',committed:40,completed:35,velocity:35,ragAtClose:'amber',blockers:['Compliance review 7-day cycle vs 5-day estimate'],keyDecisions:['Compliance review moved to async — PM approves before sprint starts'],retroSummary:'Compliance review cycle longer than planned. Process fix applied.',retroActions:[{text:'Pre-sprint compliance briefing',owner:'TM001',status:'Done'},{text:'Buffer 7 days not 5 in any sprint with compliance items',owner:'TM019',status:'Done'}],delayTraceIds:[]},
    {id:'SI-P002-S5',sprintId:'S5',projectId:'P002',name:'Sprint 5 — Reporting',committed:38,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Analytics library changed to Chart.js for licence reasons'],retroSummary:'Compliance buffer working well. Clean sprint.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P002-S6',sprintId:'S6',projectId:'P002',name:'Sprint 6 — Current',committed:42,completed:null,velocity:null,ragAtClose:'in-progress',blockers:[],keyDecisions:[],retroSummary:'In progress',retroActions:[],delayTraceIds:[]}
  ],
  P003: [
    {id:'SI-P003-S1',sprintId:'S1',projectId:'P003',name:'Sprint 1 — Meridian Foundation',committed:42,completed:24,velocity:24,ragAtClose:'red',blockers:['D002 — LMS access not provisioned across 5 locations (RESOLVED — 7-day delay)'],keyDecisions:['Sprint 0 gate added: environment verification before Sprint 1 starts'],retroSummary:'Severe LMS access issue. Escalated to steering. Resolved via account director. Key learning: environment must be confirmed before Sprint 1 starts.',retroActions:[{text:'Add environment gate to Sprint 0',owner:'TM001',status:'Done'},{text:'IT access raised as dependency at project initiation',owner:'TM008',status:'Done'}],delayTraceIds:['DT002']},
    {id:'SI-P003-S2',sprintId:'S2',projectId:'P003',name:'Sprint 2 — Content Development',committed:42,completed:null,velocity:null,ragAtClose:'in-progress',blockers:['Carried 18 pts from S1'],keyDecisions:['S1 retro actions applied — no LMS issues'],retroSummary:'In progress',retroActions:[],delayTraceIds:[]}
  ]
,

  P004:[
    {id:'SI-P004-S1',sprintId:'S1',projectId:'P004',name:'Sprint 1 — Data Assessment',committed:38,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Contingency tool approved for S2 build'],retroSummary:'Strong start. Contingency tool scoped and approved.',retroActions:[{text:'Build contingency mapping tool in S2',owner:'TM018',status:'Done'}],delayTraceIds:[]},
    {id:'SI-P004-S2',sprintId:'S2',projectId:'P004',name:'Sprint 2 — Tool Build',committed:40,completed:42,velocity:42,ragAtClose:'green',blockers:[],keyDecisions:['Contingency tool built and tested'],retroSummary:'Ahead of plan. Tool delivered.',retroActions:[{text:'Full dry-run migration in S3',owner:'TM006',status:'Done'}],delayTraceIds:[]},
    {id:'SI-P004-S3',sprintId:'S3',projectId:'P004',name:'Sprint 3 — Dry Run',committed:42,completed:42,velocity:42,ragAtClose:'green',blockers:[],keyDecisions:['Dry run: 99.7% accuracy','Rollback tested'],retroSummary:'Dry run successful. Rollback confirmed.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P004-S4',sprintId:'S4',projectId:'P004',name:'Sprint 4 — Migration Engine',committed:42,completed:42,velocity:42,ragAtClose:'green',blockers:['R004 TRIGGER FIRED — undocumented schema columns. CONTAINED in 4 hours. ZERO sprint impact.'],keyDecisions:['Risk contained by contingency tool','Zero days slipped'],retroSummary:'Risk fired and was contained. Sprint on time. This is what good risk management looks like.',retroActions:[{text:'Document tool as reusable asset',owner:'TM018',status:'Done'}],delayTraceIds:['DT003']},
    {id:'SI-P004-S5',sprintId:'S5',projectId:'P004',name:'Sprint 5 — Wave 1',committed:38,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Wave 1: 2.3M records at 99.8%'],retroSummary:'Wave 1 clean. S4 learning applied proactively.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P004-S6',sprintId:'S6',projectId:'P004',name:'Sprint 6 — Wave 2',committed:40,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['4.1M total records','Compliance checkpoints 1 and 2 cleared'],retroSummary:'Wave 2 clean.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P004-S7',sprintId:'S7',projectId:'P004',name:'Sprint 7 — Wave 3',committed:40,completed:42,velocity:42,ragAtClose:'green',blockers:[],keyDecisions:['All records migrated','99.9% accuracy','Checkpoints 3 and 4 cleared'],retroSummary:'Above threshold. All compliance cleared.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P004-S8',sprintId:'S8',projectId:'P004',name:'Sprint 8 — Go-Live',committed:38,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Go-live on exact planned date','Zero downtime','Client accepted delivery'],retroSummary:'Perfect go-live. On time, under budget.',retroActions:[{text:'Submit contingency tool to Learning Library',owner:'TM018',status:'Done'}],delayTraceIds:[]}
  ],
  P005:[
    {id:'SI-P005-S1',sprintId:'S1',projectId:'P005',name:'Sprint 1 — Foundation',committed:40,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Architecture approved'],retroSummary:'Clean foundation.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S2',sprintId:'S2',projectId:'P005',name:'Sprint 2 — Portal Core',committed:42,completed:44,velocity:44,ragAtClose:'green',blockers:[],keyDecisions:['Component library approved'],retroSummary:'Overdelivered.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S3',sprintId:'S3',projectId:'P005',name:'Sprint 3 — Authentication',committed:40,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Security review cleared'],retroSummary:'Clean sprint.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S4',sprintId:'S4',projectId:'P005',name:'Sprint 4 — Dashboard',committed:42,completed:40,velocity:40,ragAtClose:'amber',blockers:['Design review took 3 extra days'],keyDecisions:['Async approval process established'],retroSummary:'Minor delay managed.',retroActions:[{text:'Pre-approve design patterns',owner:'TM017',status:'Done'}],delayTraceIds:[]},
    {id:'SI-P005-S5',sprintId:'S5',projectId:'P005',name:'Sprint 5 — API Foundation',committed:40,completed:42,velocity:42,ragAtClose:'green',blockers:[],keyDecisions:['API versioning clause drafted'],retroSummary:'Recovered.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S6',sprintId:'S6',projectId:'P005',name:'Sprint 6 — API Integration',committed:42,completed:42,velocity:42,ragAtClose:'green',blockers:[],keyDecisions:['v2.3 integration complete in staging'],retroSummary:'Integration complete.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S7',sprintId:'S7',projectId:'P005',name:'Sprint 7 — API Production',committed:48,completed:34,velocity:34,ragAtClose:'red',blockers:['D004 — API BREAKING CHANGE v2.3 to v3.0 without notice — 3-day slip (contained from estimated 8)'],keyDecisions:['Vendor escalated','Sprint rebalanced — 14 stories deferred'],retroSummary:'Major blocker. Rapid escalation contained 8-day risk to 3-day slip.',retroActions:[{text:'90-day notice clause for all vendor API contracts',owner:'TM001',status:'Done'}],delayTraceIds:['DT004']},
    {id:'SI-P005-S8',sprintId:'S8',projectId:'P005',name:'Sprint 8 — Recovery',committed:44,completed:46,velocity:46,ragAtClose:'green',blockers:[],keyDecisions:['S7 carry-over absorbed','API lock in planning'],retroSummary:'Full recovery. Overdelivered.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S9',sprintId:'S9',projectId:'P005',name:'Sprint 9 — Testing 1',committed:40,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Vendor gave advance notice of update'],retroSummary:'Clean. Vendor coordination working.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S10',sprintId:'S10',projectId:'P005',name:'Sprint 10 — UAT',committed:42,completed:36,velocity:36,ragAtClose:'amber',blockers:['D005 — CLIENT SCOPE CREEP: 14 new widgets requested in UAT — 2-day slip (contained from 9)'],keyDecisions:['CR-005 raised immediately','3 approved, 11 deferred to Phase 2','Phase 2 scope signed'],retroSummary:'Scope creep attempt. Change control invoked. 2-day slip only.',retroActions:[{text:'Add scope re-confirmation to UAT entry gate',owner:'TM001',status:'Done'}],delayTraceIds:['DT005']},
    {id:'SI-P005-S11',sprintId:'S11',projectId:'P005',name:'Sprint 11 — UAT Phase 2',committed:38,completed:40,velocity:40,ragAtClose:'green',blockers:[],keyDecisions:['Scope re-confirmation gate — zero new requests','UAT certificate signed'],retroSummary:'Clean. S10 learning applied.',retroActions:[],delayTraceIds:[]},
    {id:'SI-P005-S12',sprintId:'S12',projectId:'P005',name:'Sprint 12 — Go-Live',committed:30,completed:30,velocity:30,ragAtClose:'green',blockers:[],keyDecisions:['Go-live 5 days after plan — fully traced','Full acceptance received'],retroSummary:'Complete. 5-day slip traced end-to-end. Learnings captured and applied.',retroActions:[{text:'Submit all 3 learnings to Learning Library',owner:'TM001',status:'Done'}],delayTraceIds:[]}
  ]
};


// PHASE 8 ENGINE

// ══════════════════════════════════════════════════════════════
//  PHASE 8 — PROGRAMME INTELLIGENCE ENGINE
// ══════════════════════════════════════════════════════════════;

DB.portfolioEpics = [
  {id:'E005',projectId:'P002',name:'Assessment Engine',colour:'#10B981',stories:12,done:10,inSprint:2,points:48,pointsDone:42},
  {id:'E006',projectId:'P002',name:'Compliance Compliance Module',colour:'#EF4444',stories:8,done:6,inSprint:2,points:35,pointsDone:28},
  {id:'E007',projectId:'P002',name:'Reporting & Analytics',colour:'#F59E0B',stories:6,done:2,inSprint:2,points:22,pointsDone:8},
  {id:'E008',projectId:'P003',name:'LMS Configuration',colour:'#7C3AED',stories:10,done:3,inSprint:3,points:40,pointsDone:12},
  {id:'E009',projectId:'P003',name:'Content Development',colour:'#0EA5E9',stories:15,done:2,inSprint:5,points:60,pointsDone:8}
,
  {id:'E010',projectId:'P004',name:'Data Assessment',colour:'#10B981',stories:8,done:8,inSprint:0,points:32,pointsDone:32},
  {id:'E011',projectId:'P004',name:'Migration Engine',colour:'#4F46E5',stories:12,done:12,inSprint:0,points:48,pointsDone:48},
  {id:'E012',projectId:'P004',name:'Validation & Go-Live',colour:'#F59E0B',stories:6,done:6,inSprint:0,points:24,pointsDone:24},
  {id:'E013',projectId:'P005',name:'Customer Portal',colour:'#7C3AED',stories:15,done:15,inSprint:0,points:60,pointsDone:60},
  {id:'E014',projectId:'P005',name:'Internal Dashboard',colour:'#0EA5E9',stories:12,done:12,inSprint:0,points:48,pointsDone:48},
  {id:'E015',projectId:'P005',name:'API Gateway',colour:'#EF4444',stories:10,done:10,inSprint:0,points:40,pointsDone:40},
  {id:'E016',projectId:'P005',name:'Integration & Testing',colour:'#10B981',stories:8,done:8,inSprint:0,points:32,pointsDone:32}
];

// ── SPRINT INTELLIGENCE PER PROJECT ───────────────────────────;

DB.team = [
  // Senior Leadership
  {id:'TM001',name:'Alex Morgan',role:'Senior PM / Programme Manager',dept:'PMO',email:'amorgan@apexsolutions.com',avatar:'SA',colour:'#4F46E5',skills:['PMBOK','SAFe','Scrum','EVM','Stakeholder Mgmt'],projects:['P001','P002','P003'],utilisation:85,capacity:42,status:'Active'},
  {id:'TM002',name:'Jordan Chen',role:'CTO / Sponsor',dept:'Leadership',email:'jchen@apexsolutions.com',avatar:'RM',colour:'#7C3AED',skills:['Strategy','Architecture','Budget'],projects:['P001','P002','P003'],utilisation:40,capacity:20,status:'Active'},
  {id:'TM003',name:'Priya Sharma',role:'Senior Business Analyst',dept:'BA',email:'priya@apexsolutions.com',avatar:'PS',colour:'#10B981',skills:['Requirements','UAT','BRD','Gap Analysis'],projects:['P001','P002'],utilisation:90,capacity:38,status:'Active'},
  // Development Teams
  {id:'TM004',name:'Arjun Kumar',role:'Tech Lead',dept:'Engineering',email:'arjun@apexsolutions.com',avatar:'AK',colour:'#EF4444',skills:['Node.js','React','API Design','CI/CD'],projects:['P001'],utilisation:95,capacity:40,status:'Active'},
  {id:'TM005',name:'Deepa Nair',role:'Senior Developer',dept:'Engineering',email:'deepa@apexsolutions.com',avatar:'DN',colour:'#F59E0B',skills:['React Native','iOS','Android'],projects:['P001','P003'],utilisation:88,capacity:38,status:'Active'},
  {id:'TM006',name:'Vikram Singh',role:'Full Stack Developer',dept:'Engineering',email:'vikram@apexsolutions.com',avatar:'VS',colour:'#0EA5E9',skills:['Python','Django','PostgreSQL'],projects:['P002'],utilisation:92,capacity:40,status:'Active'},
  {id:'TM007',name:'Anjali Patel',role:'Frontend Developer',dept:'Engineering',email:'anjali@apexsolutions.com',avatar:'AP',colour:'#10B981',skills:['Vue.js','TypeScript','CSS'],projects:['P002','P003'],utilisation:75,capacity:36,status:'Active'},
  {id:'TM008',name:'Rohit Das',role:'DevOps Engineer',dept:'Engineering',email:'rohit@apexsolutions.com',avatar:'RD',colour:'#8B5CF6',skills:['AWS','Docker','Kubernetes','CI/CD'],projects:['P001','P002','P003'],utilisation:80,capacity:38,status:'Active'},
  // QA Team
  {id:'TM009',name:'Meena Krishnan',role:'QA Lead',dept:'Quality',email:'meena@apexsolutions.com',avatar:'MK',colour:'#EF4444',skills:['Test Strategy','Automation','UAT','Performance Testing'],projects:['P001','P002'],utilisation:85,capacity:40,status:'Active'},
  {id:'TM010',name:'Suresh Babu',role:'QA Engineer',dept:'Quality',email:'suresh@apexsolutions.com',avatar:'SB',colour:'#F59E0B',skills:['Selenium','Jest','API Testing'],projects:['P001'],utilisation:78,capacity:38,status:'Active'},
  {id:'TM011',name:'Kavitha Reddy',role:'QA Engineer',dept:'Quality',email:'kavitha@apexsolutions.com',avatar:'KR',colour:'#10B981',skills:['Manual Testing','UAT','Regression'],projects:['P002','P003'],utilisation:72,capacity:36,status:'Active'},
  // L&D / Training Team
  {id:'TM012',name:'Lakshmi Iyer',role:'Learning Designer',dept:'L&D',email:'lakshmi@apexsolutions.com',avatar:'LI',colour:'#7C3AED',skills:['ADDIE','Bloom\'s','Articulate','LMS'],projects:['P003'],utilisation:88,capacity:38,status:'Active'},
  {id:'TM013',name:'Mohan Pillai',role:'Training Coordinator',dept:'L&D',email:'mohan@apexsolutions.com',avatar:'MP',colour:'#0EA5E9',skills:['LMS Admin','Assessment Design','Scheduling'],projects:['P003'],utilisation:65,capacity:30,status:'Active'},
  // Business & Compliance
  {id:'TM014',name:'Compliance Director',role:'Head of Compliance',dept:'Compliance',email:'compliance@nexusfinancial.com',avatar:'CH',colour:'#EF4444',skills:['Regulatory Review','SEBI','AMFI'],projects:['P002'],utilisation:30,capacity:12,status:'External'},
  {id:'TM015',name:'Nisha Thomas',role:'Product Owner',dept:'Product',email:'nisha@apexsolutions.com',avatar:'NT',colour:'#10B981',skills:['Product Roadmap','Backlog Grooming','Stakeholder Comms'],projects:['P001','P002'],utilisation:85,capacity:40,status:'Active'},
  // Extended team placeholders (simulating 200-member org)
  {id:'TM016',name:'Arun Mehta',role:'Senior Developer',dept:'Engineering',email:'arun@apexsolutions.com',avatar:'AM',colour:'#4F46E5',skills:['Java','Spring Boot','Microservices'],projects:['P002'],utilisation:90,capacity:40,status:'Active'},
  {id:'TM017',name:'Divya Pillai',role:'UX Designer',dept:'Design',email:'divya@apexsolutions.com',avatar:'DP',colour:'#F59E0B',skills:['Figma','UX Research','Prototyping'],projects:['P001','P003'],utilisation:70,capacity:34,status:'Active'},
  {id:'TM018',name:'Karthik Rajan',role:'Data Engineer',dept:'Engineering',email:'karthik@apexsolutions.com',avatar:'KJ',colour:'#8B5CF6',skills:['Python','Spark','Data Pipelines'],projects:['P002'],utilisation:82,capacity:38,status:'Active'},
  {id:'TM019',name:'Swathi Naidu',role:'Scrum Master',dept:'PMO',email:'swathi@apexsolutions.com',avatar:'SN',colour:'#10B981',skills:['Scrum','Kanban','Facilitation','Impediment Removal'],projects:['P001','P002'],utilisation:75,capacity:36,status:'Active'},
  {id:'TM020',name:'Balaji Kumar',role:'Infrastructure Architect',dept:'Engineering',email:'balaji@apexsolutions.com',avatar:'BK',colour:'#EF4444',skills:['AWS','GCP','Network','Security'],projects:['P001','P002','P003'],utilisation:60,capacity:28,status:'Active'}
];

// ── MULTI-PROJECT STORE ────────────────────────────────────────;

const ROLE_CONFIGS = {
  pm: { label:'Project Manager', visible:['dashboard','raid','heatmap','issues','stakeholders','pigrid','engagement','raci','comms','rag','cr','escalation','decisions','audit','reports','import','backlog','sprint','burndown','velocity','retro','delivery','timeline','intelligence','impact','people','evm','newproject','learning','delivery-answer'], readOnly:[] },
  team: { label:'Team Member', visible:['dashboard','sprint','backlog','burndown','retro','delivery'], readOnly:['dashboard','backlog','burndown','delivery'] },
  stakeholder: { label:'Client / Stakeholder', visible:['dashboard','rag','delivery-answer'], readOnly:['dashboard','rag','delivery-answer'] },
  sponsor: { label:'Sponsor / Executive', visible:['dashboard','rag','cr','escalation','evm','reports','delivery-answer','impact'], readOnly:['cr'] },
  pmo: { label:'PMO Head / Portfolio Manager', visible:['dashboard','timeline','intelligence','impact','people','evm','reports','audit','learning','delivery-answer','raid','heatmap','rag'], readOnly:['raid','heatmap'] },
  auditor: { label:'Auditor / Compliance', visible:['audit','reports','cr','decisions','delivery-answer'], readOnly:['audit','reports','cr','decisions','delivery-answer'] }
};

const TEMPLATES = [
  {
    id:'T001', name:'Mobile App', icon:'📱', colour:'#4F46E5',
    desc:'Native or hybrid mobile app with API integration',
    tags:['Agile','Mobile','Integration'],
    method:'hybrid',
    risks:['Vendor API delivery','App store approval delays','Device fragmentation','Security review'],
    epics:['Authentication','Core Features','API Integration','UI/UX','Testing & QA'],
    stakeholders:['Client Sponsor','Tech Lead','End Users','Compliance'],
    defaultSprint:14, defaultVelocity:42,
    preloadedRisks:[
      {desc:'Third-party API vendor fails to deliver on schedule',cat:'External',prob:3,impact:5,score:15,trigger:'Vendor misses first agreed milestone',response:'Mitigate',mitigation:'Build internal wrapper in parallel',contingency:'Activate wrapper, brief steering within 24hrs'},
      {desc:'App store review process delays launch date',cat:'External',prob:2,impact:4,score:8,trigger:'App submitted and not approved within 7 days',response:'Mitigate',mitigation:'Submit early builds for review in Sprint 6',contingency:'Soft launch via TestFlight while review continues'}
    ]
  },
  {
    id:'T002', name:'Compliance Portal', icon:'⚖️', colour:'#10B981',
    desc:'Regulatory compliance platform with approval workflows',
    tags:['PMBOK','Compliance','Portal'],
    method:'hybrid',
    risks:['Regulatory review cycle','Scope creep from compliance changes','Data migration'],
    epics:['Compliance Engine','Assessment Module','Reporting','User Management','Audit Trail'],
    stakeholders:['Compliance Director','Regulator Liaison','End Users','IT Security'],
    defaultSprint:14, defaultVelocity:38,
    preloadedRisks:[
      {desc:'Compliance review cycle longer than estimated (est. 5 days, actual often 12)',cat:'Process',prob:4,impact:4,score:16,trigger:'Review not completed by Sprint Planning day',response:'Mitigate',mitigation:'Buffer 7 days per compliance item in sprint planning',contingency:'Async review process — PM pre-approves content before formal sign-off'},
      {desc:'Regulatory requirements change mid-project',cat:'External',prob:3,impact:5,score:15,trigger:'Regulator issues new guidance during project',response:'Mitigate',mitigation:'Weekly regulatory watch with compliance head',contingency:'Change freeze assessment + emergency CCB within 48hrs'}
    ]
  },
  {
    id:'T003', name:'Training Rollout', icon:'🎓', colour:'#F59E0B',
    desc:'L&D programme across multiple locations',
    tags:['L&D','ADDIE','Multi-location'],
    method:'ld',
    risks:['LMS access','Content approval delays','Trainer availability','Attendance rates'],
    epics:['TNA & Design','Content Development','Pilot','Rollout','Measurement'],
    stakeholders:['L&D Head','Business Sponsors','Trainers','Compliance','Learners'],
    defaultSprint:14, defaultVelocity:35,
    preloadedRisks:[
      {desc:'LMS environment not provisioned across all locations before Sprint 1',cat:'Technical',prob:3,impact:5,score:15,trigger:'LMS access not confirmed 5 days before Sprint 1 start',response:'Mitigate',mitigation:'Add LMS access as Sprint 0 gate — project cannot start without it',contingency:'Escalate to IT head and client account director simultaneously'},
      {desc:'Target audience (learners) resistant to training time commitment',cat:'People',prob:3,impact:4,score:12,trigger:'Attendance below 70% in first session',response:'Mitigate',mitigation:'Stakeholder engagement before launch — address time concerns proactively',contingency:'Redesign session format (shorter, different timing) based on feedback'}
    ]
  },
  {
    id:'T004', name:'Digital Transformation', icon:'🔄', colour:'#7C3AED',
    desc:'Large-scale digital transformation programme',
    tags:['SAFe','Programme','Transformation'],
    method:'safe',
    risks:['Change resistance','Legacy system complexity','Budget overrun','Skill gaps'],
    epics:['Foundation & Architecture','Data Migration','Process Redesign','Training','Cutover'],
    stakeholders:['Executive Sponsor','Change Manager','Business Leads','IT Architecture','End Users'],
    defaultSprint:14, defaultVelocity:45,
    preloadedRisks:[
      {desc:'Organisational resistance to new processes',cat:'People',prob:4,impact:5,score:20,trigger:'More than 20% of affected staff actively oppose change in survey',response:'Mitigate',mitigation:'Change management programme running in parallel from day 1',contingency:'Executive mandate + individual engagement plan for resistant leaders'}
    ]
  },
  {
    id:'T005', name:'Infrastructure / Cloud', icon:'☁️', colour:'#0EA5E9',
    desc:'Cloud migration or infrastructure modernisation',
    tags:['Technical','Cloud','DevOps'],
    method:'hybrid',
    risks:['Data loss','Downtime','Security vulnerabilities','Cost overrun'],
    epics:['Assessment & Design','Environment Setup','Migration Waves','Testing','Cutover & Handover'],
    stakeholders:['CTO','Security Team','Operations','Business Owners','Vendors'],
    defaultSprint:14, defaultVelocity:40,
    preloadedRisks:[
      {desc:'Data loss or corruption during migration',cat:'Technical',prob:2,impact:5,score:10,trigger:'Any data integrity check fails during migration testing',response:'Mitigate',mitigation:'Full backup before every migration wave. Rollback plan tested in staging.',contingency:'Immediate rollback to source system. RCA before proceeding.'}
    ]
  },
  {
    id:'T006', name:'Blank Project', icon:'📄', colour:'#94A3B8',
    desc:'Start completely from scratch with no pre-loaded content',
    tags:['Custom'],
    method:'hybrid',
    risks:[], epics:[], stakeholders:[],
    defaultSprint:14, defaultVelocity:40, preloadedRisks:[]
  }
];

const WIZ_QUESTIONS = [
  // ── CONVERSATION 1: FOUNDATION ──
  {id:1, conv:'Conversation 1 — Foundation', q:'What is this project called?',
   why:'The project name appears on every report, every communication, every steering pack. Make it clear and specific.',
   type:'text', placeholder:'e.g. Branch Manager Mobile App, Nexus Compliance Portal', field:'name', required:true},

  {id:2, conv:'Conversation 1 — Foundation', q:'What problem does this project solve — or what opportunity does it create?',
   why:'This is the single statement everyone returns to when scope creep appears or priorities conflict. If a decision does not serve this purpose, it probably should not be made.',
   type:'textarea', placeholder:'Write in plain language as if explaining to someone who knows nothing about your organisation.\n\ne.g. "Branch managers are missing urgent client alerts because they only check email. We need push notifications so response time drops from 4 hours to 30 minutes."',
   field:'purpose', required:true},

  {id:3, conv:'Conversation 1 — Foundation', q:'Who asked for this project — and why does it need to happen now?',
   why:'The urgency driver determines your escalation strategy before the project starts. A regulatory deadline is non-negotiable. An internal initiative can slip. Know which one you have.',
   type:'options', field:'urgencyType', options:[
     {value:'regulatory', icon:'⚖️', title:'Regulatory or Compliance Deadline', desc:'Non-negotiable. Missing this date has legal or financial consequences.'},
     {value:'client', icon:'🤝', title:'Client Contract or Commitment', desc:'Agreed with a client. Late delivery damages the relationship and may trigger penalties.'},
     {value:'business', icon:'📈', title:'Internal Business Event', desc:'Important but negotiable. Tied to a launch, financial year, or strategic initiative.'},
     {value:'opportunity', icon:'💡', title:'Market Opportunity', desc:'Window of opportunity. Delay means a competitor may move first.'},
     {value:'improvement', icon:'🔧', title:'Internal Improvement Initiative', desc:'Valuable but flexible. Priority may compete with other initiatives.'}
   ]},

  {id:4, conv:'Conversation 1 — Foundation', q:'What will measurably exist at the end of this project that does not exist today?',
   why:'Not activities — outcomes. The test: Can you measure whether this exists or not on the last day? If yes, it is a good outcome statement. If it is vague, delays are already being built in.',
   type:'textarea', placeholder:'Describe the deliverable and its measurable impact.\n\ne.g. "Branch managers will have a mobile app on their phones that sends them client alerts within 60 seconds. Response time will drop from 4 hours to 30 minutes — measurable at 30-day post-launch review."',
   field:'outcome', required:true},

  {id:5, conv:'Conversation 1 — Foundation', q:'How will you know on the last day whether this project truly succeeded?',
   why:'This becomes your outcome measurement plan — the difference between "we delivered the app" (activity) and "response time dropped to 30 minutes" (value). Success criteria defined now prevent arguments at closure.',
   type:'textarea', placeholder:'Write 2–3 specific, measurable success criteria with numbers.\n\ne.g.\n• Branch manager alert response time ≤ 30 minutes (measured 30 days post-launch)\n• App adoption rate ≥ 80% of target users within 60 days\n• Zero critical security vulnerabilities at launch',
   field:'successCriteria', required:true},

  {id:6, conv:'Conversation 1 — Foundation', q:'What is explicitly OUT of scope for this project?',
   why:'Every scope dispute that ever caused a delay started with something that was never formally excluded. This is the most skipped question in project management. VeloClear makes it mandatory.',
   type:'textarea', placeholder:'List what will NOT be delivered in this project.\n\ne.g.\n• Desktop or web version (mobile only)\n• Integration with third-party CRM (Phase 2)\n• Offline mode for poor connectivity areas\n• Multi-language support',
   field:'outOfScope', required:false},

  {id:7, conv:'Conversation 1 — Foundation', q:'Has a similar project been done before — in your organisation or elsewhere?',
   why:'Starting with institutional knowledge prevents repeating the same mistakes. VeloClear will surface relevant learnings from the library automatically.',
   type:'options', field:'similarProject', options:[
     {value:'yes_internal', icon:'✅', title:'Yes — we have done this before internally', desc:'I can reference what we learned last time.'},
     {value:'yes_external', icon:'🔍', title:'Similar project done elsewhere', desc:'I have knowledge from industry or previous employers.'},
     {value:'partially', icon:'🔶', title:'Similar in parts', desc:'Some elements are familiar, others are new territory.'},
     {value:'no', icon:'🆕', title:'First time for this type of project', desc:'We are learning as we go. We need extra support on risk identification.'}
   ]},

  // ── CONVERSATION 2: CONSTRAINTS ──
  {id:8, conv:'Conversation 2 — Constraints', q:'What is the target delivery date — and what type of deadline is it?',
   why:'A date with a reason is a constraint. A date without a reason is a guess. VeloClear will flag if your team capacity makes the date unrealistic before you commit to it publicly.',
   type:'date_with_type', field:'targetDate', dateField:'deliveryDate', typeField:'dateType',
   dateLabel:'Target delivery date',
   dateTypes:[
     {value:'hard_regulatory', label:'Hard — Regulatory (cannot move)'},
     {value:'hard_contract', label:'Hard — Client Contract (penalty if missed)'},
     {value:'soft_business', label:'Soft — Business Event (important but negotiable)'},
     {value:'estimated', label:'Estimated — Based on team capacity (flexible)'}
   ]},

  {id:9, conv:'Conversation 2 — Constraints', q:'What is the approved budget for this project?',
   why:'This is your BAC — Budget at Completion. It becomes the baseline for all EVM calculations. CPI, EAC, and VAC all derive from this number. Enter 0 if budget is not yet approved.',
   type:'currency', field:'bac', placeholder:'e.g. 3000000', label:'Budget at Completion (₹)',
   hint:'Enter in Rupees. e.g. ₹30 Lakhs = 3000000'},

  {id:10, conv:'Conversation 2 — Constraints', q:'Of these three — scope, schedule, cost — which ONE is fixed and which can flex?',
   why:'No project can fix all three. Making this explicit at the start prevents the most common argument in delivery. When something goes wrong, this decision tells you which lever to pull.',
   type:'triple_constraint', field:'fixedConstraint'},

  {id:11, conv:'Conversation 2 — Constraints', q:'What quality standard must this project meet?',
   why:'Quality is the constraint that gets sacrificed when the other three are all "fixed." Making it explicit prevents this. A specific standard also defines your Definition of Done.',
   type:'textarea', placeholder:'Be specific. Not "high quality" but measurable standards.\n\ne.g.\n• SEBI AMFI compliance (mandatory)\n• App performance: load time < 3 seconds on 4G\n• Security: no critical vulnerabilities (OWASP Top 10)\n• Test coverage: > 85% unit test coverage',
   field:'qualityStandard'},

  {id:12, conv:'Conversation 2 — Constraints', q:'Are there any other non-negotiable constraints I have not mentioned?',
   why:'Every project has at least one unique constraint that does not fit a standard category. This is where you capture it — before it surprises you mid-delivery.',
   type:'textarea', placeholder:'e.g. Must use existing on-premise server (no cloud). All data must remain within India. Procurement process requires 6-week vendor onboarding.',
   field:'otherConstraints', required:false},

  // ── CONVERSATION 3: PEOPLE ──
  {id:13, conv:'Conversation 3 — People', q:'Who is the sponsor — the single person accountable if this project fails?',
   why:'If the answer is "a steering committee" — that is governance, not sponsorship. One person must own the outcome. Without a named sponsor, escalations have no destination and decisions take forever.',
   type:'person', field:'sponsor',
   nameField:'sponsorName', roleField:'sponsorRole', emailField:'sponsorEmail',
   hint:'One person. Not a team. The person who will stand in front of the client or board and say "this is my project."'},

  {id:14, conv:'Conversation 3 — People', q:'How will this project be delivered?',
   why:'Your delivery method determines every subsequent question in this wizard, the modules VeloClear activates, and the governance framework it sets up.',
   type:'method_select', field:'method'},

  {id:15, conv:'Conversation 3 — People', q:'How large is the project team?',
   why:'Team size determines the complexity of your RACI, governance model, and communication plan. A 3-person team and a 50-person team have very different coordination needs.',
   type:'options', field:'teamSize', options:[
     {value:'solo', icon:'👤', title:'Solo — Just me', desc:'You are the PM and the doer. Lightweight tracking.'},
     {value:'small', icon:'👥', title:'Small team — 2 to 10 people', desc:'Close-knit. Daily standups. Informal communication works.'},
     {value:'medium', icon:'🏢', title:'Medium team — 11 to 30 people', desc:'Needs structured communication. RACI essential.'},
     {value:'large', icon:'🏗️', title:'Large team — 31 to 100 people', desc:'Multiple work streams. Formal governance. Weekly steering.'},
     {value:'programme', icon:'🏛️', title:'Programme — 100+ people', desc:'Multiple projects or teams. ART-level coordination. PI Planning.'}
   ]},

  {id:16, conv:'Conversation 3 — People', q:'Are any team members shared with other active projects?',
   why:'Shared resources are the most common untracked cause of sprint delays. If two projects share a QA lead and both reach UAT at the same time, one of them will slip. VeloClear flags this conflict before it happens.',
   type:'yesno_detail', field:'sharedResources',
   yesPrompt:'Name the shared team members and their other projects. VeloClear will flag capacity conflicts.',
   yesPlaceholder:'e.g. QA Lead (Meena) — also on Nexus Compliance Portal\nDevOps Engineer (Rohit) — shared across all 3 projects'},

  {id:17, conv:'Conversation 3 — People', q:'Does this project depend on any external vendors, contractors, or other teams?',
   why:'External dependencies immediately pre-populate your Dependencies register in the RAID log. Every external dependency needs an owner, a delivery date, and a risk rating.',
   type:'yesno_detail', field:'externalDeps',
   yesPrompt:'List what you depend on externally, who provides it, and when you need it.',
   yesPlaceholder:'e.g. Vendor API documentation — TechBridge Systems — needed by Sprint 2 Day 1\nUAT test data — Client IT Team — needed by Sprint 4'},

  {id:18, conv:'Conversation 3 — People', q:'Is there a key person whose absence would stop this project?',
   why:'This is the People risk that gets missed most often. The developer who knows the legacy system. The compliance officer who is the only one who can sign off. Document it now.',
   type:'yesno_detail', field:'keyPerson',
   yesPrompt:'Who is this person, what do they uniquely own, and what is the backup plan?',
   yesPlaceholder:'e.g. Arjun Kumar (Tech Lead) — only person who knows the vendor API integration design. Backup: document all integration decisions daily in Confluence.'},

  // ── CONVERSATION 4: RISKS ──
  {id:19, conv:'Conversation 4 — Risks', q:'What is the single biggest thing that could prevent this project from delivering on time?',
   why:'Your gut is usually right. This becomes Risk R001 — the primary risk — and gets the most attention in your RAID log. Write it as a specific scenario, not a vague concern.',
   type:'textarea', field:'biggestRisk', required:true,
   placeholder:'Write as a specific scenario.\n\ne.g. "The third-party API vendor may fail to deliver the sandbox environment before Sprint 2, blocking all integration work and delaying go-live by 3–4 weeks."'},

  {id:20, conv:'Conversation 4 — Risks', q:'Which of these risk categories apply to your project?',
   why:'Each selection pre-populates your RAID log with a complete risk entry — description, probability, impact, trigger, and mitigation. You review and adjust. You do not start from zero.',
   type:'risk_checklist', field:'riskCategories'},

  {id:21, conv:'Conversation 4 — Risks', q:'What assumptions are you making that, if wrong, would significantly change this project?',
   why:'Most projects fail this question and spend months arguing about assumptions that were never documented. Name them now. Set a validation date for each one.',
   type:'textarea', field:'assumptions', required:false,
   placeholder:'List assumptions that must be true for this project to succeed.\n\ne.g.\n• Compliance team will complete reviews within 5 working days\n• Client will provide access to test environment by Sprint 1 Day 3\n• Budget approval will be confirmed before Sprint 2 starts'},

  // ── CONVERSATION 5: GOVERNANCE ──
  {id:22, conv:'Conversation 5 — Governance', q:'How often will you report project status to your sponsor or steering committee?',
   why:'This sets your communication cadence automatically. Governance without a regular cadence is just bureaucracy. Governance with a cadence is accountability.',
   type:'options', field:'reportingCadence', options:[
     {value:'weekly', icon:'📅', title:'Weekly', desc:'Active projects with high risk or stakeholder complexity'},
     {value:'fortnightly', icon:'🗓️', title:'Fortnightly', desc:'Most projects. Aligns with sprint rhythm.'},
     {value:'monthly', icon:'📊', title:'Monthly', desc:'Stable projects with low risk and high trust'},
     {value:'milestone', icon:'🏁', title:'Milestone-based', desc:'Waterfall projects. Report at phase gates.'}
   ]},

  {id:23, conv:'Conversation 5 — Governance', q:'Who needs to approve budget changes — and at what threshold?',
   why:'Without documented decision rights, every decision becomes a negotiation. These thresholds drive automatic CR routing in VeloClear.',
   type:'decision_rights', field:'decisionRights'},

  {id:24, conv:'Conversation 5 — Governance', q:'Who are your escalation contacts at each stage?',
   why:'Who do you call at 9pm when a critical risk fires? Escalation contacts defined now mean you never have to search for a phone number in a crisis.',
   type:'escalation_contacts', field:'escalationContacts'},

  // ── CONVERSATION 6: MEASUREMENT ──
  {id:25, conv:'Conversation 6 — Measurement', q:'How long is each sprint or delivery cycle?',
   why:'Your sprint length sets the heartbeat of the project. Two weeks is the most common for Agile. Waterfall projects use phase gate milestones instead.',
   type:'options', field:'sprintDays', options:[
     {value:7, icon:'⚡', title:'1 week', desc:'High urgency, frequent feedback, very short cycles'},
     {value:14, icon:'🏃', title:'2 weeks (Recommended)', desc:'The most common. Enough time to deliver meaningful work, short enough to correct course.'},
     {value:21, icon:'📅', title:'3 weeks', desc:'Larger features, more planning time needed'},
     {value:28, icon:'🗓️', title:'4 weeks', desc:'Complex integrations, formal review cycles'},
     {value:0, icon:'🏁', title:'Milestone-based (Waterfall)', desc:'No sprints — delivery tracked by phase gate completion'}
   ]},

  {id:26, conv:'Conversation 6 — Measurement', q:'What is your team\'s estimated sprint velocity — story points per sprint?',
   why:'This is the number VeloClear uses to forecast your delivery date. If you do not know yet, it will calibrate automatically after Sprint 1 and Sprint 2 using your actual delivery data.',
   type:'velocity_input', field:'velocity'},

  {id:27, conv:'Conversation 6 — Measurement', q:'What does "Done" mean for this project?',
   why:'Without a Definition of Done, "90% complete" is the status that never becomes 100%. Every story on your sprint board must meet every criterion on this list before it can be marked Done.',
   type:'dod_builder', field:'definitionOfDone'},

  {id:28, conv:'Conversation 6 — Measurement', q:'How will you measure whether this project delivered real value — not just on time and on budget?',
   why:'This is the difference between delivering the project and delivering the outcome. Tied to your success criteria from Question 5. Most projects never measure this. Yours will.',
   type:'textarea', field:'valueMeasurement', required:false,
   placeholder:'Link your success criteria to a measurement plan.\n\ne.g.\n• Response time drop: measured by ops team at Day 30 and Day 90 post-launch using existing monitoring tool\n• App adoption: tracked via app analytics dashboard — PM reviews monthly for 6 months\n• User satisfaction: NPS survey at 60 days post-launch'},

  // ── CONVERSATION 7: LEARNING ──
  {id:29, conv:'Conversation 7 — Learning', q:'Has this team worked together before?',
   why:'A team that has worked together has established rhythms. A new team needs explicit working agreements, a team charter, and more structured communication in the first two sprints.',
   type:'options', field:'teamHistory', options:[
     {value:'same', icon:'✅', title:'Same team as last project', desc:'We know each other. Established working patterns.'},
     {value:'mostly', icon:'🔶', title:'Mostly the same — a few new people', desc:'Core team is familiar. New members need onboarding.'},
     {value:'mixed', icon:'🔀', title:'Mixed — roughly half and half', desc:'Some established relationships, some new dynamics.'},
     {value:'new', icon:'🆕', title:'New team — we have not worked together', desc:'Everything needs to be established from scratch. Allow extra time in Sprint 1.'}
   ]},

  {id:30, conv:'Conversation 7 — Learning', q:'What went wrong on the last similar project you were involved in?',
   why:'Starting with institutional knowledge prevents repeating history. Your answer pre-populates the RAID log with lessons-learned risks. The most accurate risk register is one built from real experience.',
   type:'textarea', field:'pastLessons', required:false,
   placeholder:'What do you wish you had known at the start of your last project?\n\ne.g. "Compliance reviews always take longer than estimated. We should have built a 7-day buffer in every sprint. Instead we found out in Sprint 4 and had to replan."\n\nIf this is your first project, leave blank.'},

  {id:31, conv:'Conversation 7 — Learning', q:'What is the one thing you are most worried about on this project?',
   why:'The honest answer. This goes into your PM Notes — visible only to you. It is not governance. It is self-awareness. And it is often the most accurate early warning signal in the entire project.',
   type:'textarea', field:'pmWorry', required:false,
   placeholder:'Be honest. This is private — only you can see it.\n\ne.g. "The client has a history of adding scope at the last minute and then blaming us for being late. I am worried we will agree to too many CRs under pressure."'},

  // ── FINAL REVIEW ──
  {id:32, conv:'Conversation 8 — Final Review', q:'Review: Project Identity', type:'review_identity', field:'review1'},
  {id:33, conv:'Conversation 8 — Final Review', q:'Review: Constraints & Risks', type:'review_constraints', field:'review2'},
  {id:34, conv:'Conversation 8 — Final Review', q:'Your project is ready. Here is what VeloClear built from your answers.', type:'wizard_complete', field:'complete'}
];

var VC = {
  currentRole: 'pm', activeProject: 'P001',
  org: { setupDone: false, name: 'My Organisation', type: 'consulting', methods: ['agile'] }
};
var wizStep = 1, wizAnswers = {}, wizardTemplate = null, selectedSetupRole = 'pm', cur = 'dashboard';

// FitForge Comprehensive Exercise Library
export const exercisesData = [
  // ─── STRENGTH: CHEST ────────────────────────────────────────────────────────
  {
    id: "ex-1",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    muscle: "Chest",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Intermediate",
    sets: 4,
    reps: 10,
    weight: 40,
    rest: 90,
    description: "Compound upper body lift targeting the pectoralis major, anterior deltoids, and triceps.",
    instructions: [
      "Lie flat on the bench with eyes directly under the bar.",
      "Grip the bar slightly wider than shoulder-width, wrists straight.",
      "Unrack the bar and lower it with control to mid-chest.",
      "Drive through the floor and press the bar upwards back to lockout."
    ],
    tips: "Keep your shoulder blades retracted and depressed throughout the entire movement."
  },
  {
    id: "ex-2",
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    muscle: "Chest",
    equipment: "Dumbbell",
    type: "strength",
    difficulty: "Intermediate",
    sets: 3,
    reps: 12,
    weight: 16,
    rest: 75,
    description: "Emphasizes the clavicular head of the pectoral muscle (upper chest).",
    instructions: [
      "Set bench to 30-45 degree angle.",
      "Bring dumbbells to shoulder level with elbows angled at ~45 degrees.",
      "Press weights upward without letting them clank at the top.",
      "Lower under control feeling a deep stretch across the upper pecs."
    ],
    tips: "Avoid arching excessively to preserve tension on the upper chest."
  },
  {
    id: "ex-3",
    name: "Cable Chest Flyes",
    muscleGroup: "Chest",
    muscle: "Chest",
    equipment: "Cable",
    type: "strength",
    difficulty: "Beginner",
    sets: 3,
    reps: 15,
    weight: 12.5,
    rest: 60,
    description: "Isolation movement providing continuous tension across the full pectoral range of motion.",
    instructions: [
      "Set pulleys at chest height. Take one step forward with a staggered stance.",
      "Slight bend in elbows. Bring hands together in an arc hugging a wide barrel.",
      "Squeeze chest hard at peak contraction for 1 second, then control back."
    ],
    tips: "Focus on bringing your inner biceps together rather than just touching hands."
  },

  // ─── STRENGTH: BACK ─────────────────────────────────────────────────────────
  {
    id: "ex-4",
    name: "Barbell Bent-Over Row",
    muscleGroup: "Back",
    muscle: "Back",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Intermediate",
    sets: 4,
    reps: 8,
    weight: 50,
    rest: 90,
    description: "Primary horizontal pull builder for mid-back thickness, rhomboids, and lats.",
    instructions: [
      "Hinge forward at hips at a 45-degree angle, spine neutral, knees unlocked.",
      "Pull bar towards your lower ribcage, driving elbows past your torso.",
      "Squeeze shoulder blades together at peak contraction, lower under control."
    ],
    tips: "Brace core hard and do not use torso momentum to yank the bar up."
  },
  {
    id: "ex-5",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    muscle: "Back",
    equipment: "Machine",
    type: "strength",
    difficulty: "Beginner",
    sets: 3,
    reps: 10,
    weight: 45,
    rest: 60,
    description: "Vertical pull developer emphasizing lat width and upper posterior chain control.",
    instructions: [
      "Grip wide bar just outside shoulders, sit with thighs snug under pads.",
      "Lean back slightly (~10-15 degrees), pull bar down towards upper chest.",
      "Depress shoulders and drive elbows down, then slowly let bar return up."
    ],
    tips: "Think about pulling with your elbows rather than gripping with forearms."
  },
  {
    id: "ex-6",
    name: "Barbell Deadlift",
    muscleGroup: "Back",
    muscle: "Back",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Advanced",
    sets: 4,
    reps: 5,
    weight: 80,
    rest: 120,
    description: "The ultimate posterior chain compound exercise engaging hamstrings, glutes, and spinal erectors.",
    instructions: [
      "Stand with midfoot under the barbell, feet hip-width apart.",
      "Hinge and grip bar just outside knees with arms fully vertical.",
      "Pull slack out of bar, flatten back, drive legs into floor to stand tall."
    ],
    tips: "Keep the bar against your shins and thighs throughout the entire pull."
  },
  {
    id: "ex-7",
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    muscle: "Legs",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Intermediate",
    sets: 3,
    reps: 10,
    weight: 50,
    rest: 90,
    description: "Eccentric hip-hinge targeting hamstring lengthening, glute power, and lower back stability.",
    instructions: [
      "Stand tall holding barbell at hip level with shoulder-width overhand grip.",
      "Push hips back while maintaining a slight knee bend and flat spine.",
      "Lower bar to mid-shin level feeling a deep hamstring stretch, then drive hips forward."
    ],
    tips: "Movement originates from hip backward travel, not bending knees down."
  },

  // ─── STRENGTH: LEGS ─────────────────────────────────────────────────────────
  {
    id: "ex-8",
    name: "Barbell Back Squat",
    muscleGroup: "Legs",
    muscle: "Legs",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Intermediate",
    sets: 4,
    reps: 8,
    weight: 70,
    rest: 120,
    description: "King of lower body development targeting quadriceps, adductors, glutes, and core.",
    instructions: [
      "Rest bar across upper traps, step back into shoulder-width stance.",
      "Brace core, push hips back and knees out in line with toes.",
      "Descend until thighs break parallel, drive forcefully upward through midfoot."
    ],
    tips: "Keep your chest proud and knees tracking in line with second toes."
  },
  {
    id: "ex-9",
    name: "Leg Press",
    muscleGroup: "Legs",
    muscle: "Legs",
    equipment: "Machine",
    type: "strength",
    difficulty: "Beginner",
    sets: 3,
    reps: 12,
    weight: 120,
    rest: 90,
    description: "Machine-guided quad overload allowing maximum resistance without spinal shear stress.",
    instructions: [
      "Sit back firmly in seat, feet shoulder-width on center platform.",
      "Release safety pins and lower sled until knees reach 90 degrees.",
      "Press platform back up without hyper-extending knees at top lockout."
    ],
    tips: "Never let lower back or tailbone peel off the back pad at bottom."
  },

  // ─── STRENGTH: SHOULDERS ────────────────────────────────────────────────────
  {
    id: "ex-10",
    name: "Overhead Shoulder Press",
    muscleGroup: "Shoulders",
    muscle: "Shoulders",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Intermediate",
    sets: 4,
    reps: 8,
    weight: 35,
    rest: 90,
    description: "Vertical pressing compound for anterior and lateral deltoid mass and overhead stability.",
    instructions: [
      "Rack bar at collarbone height, grip just outside shoulder width.",
      "Tighten glutes and abs, press bar straight up clearing chin.",
      "Lock out overhead with head pressing through 'window' between arms."
    ],
    tips: "Keep core rigid to avoid leaning back into a pseudo-incline press."
  },
  {
    id: "ex-11",
    name: "Dumbbell Lateral Raises",
    muscleGroup: "Shoulders",
    muscle: "Shoulders",
    equipment: "Dumbbell",
    type: "strength",
    difficulty: "Beginner",
    sets: 4,
    reps: 15,
    weight: 8,
    rest: 60,
    description: "Pure isolation for the lateral deltoid head to build broad shoulder silhouette.",
    instructions: [
      "Hold dumbbells at sides with slight forward lean from hips.",
      "Raise arms out to sides in scapular plane until parallel to floor.",
      "Lower with controlled 2-second tempo resisting gravity."
    ],
    tips: "Lead with elbows, not wrists, and keep traps relaxed."
  },

  // ─── STRENGTH: ARMS ─────────────────────────────────────────────────────────
  {
    id: "ex-12",
    name: "Dumbbell Bicep Curls",
    muscleGroup: "Arms",
    muscle: "Arms",
    equipment: "Dumbbell",
    type: "strength",
    difficulty: "Beginner",
    sets: 3,
    reps: 12,
    weight: 12,
    rest: 60,
    description: "Unilateral bicep curl allowing supination through full elbow flexion.",
    instructions: [
      "Hold pair of dumbbells with neutral hammer grip.",
      "Curl weight up while supinating wrist so palm faces shoulder at top.",
      "Squeeze peak bicep contraction, slowly lower back to neutral."
    ],
    tips: "Keep elbows glued by sides; do not swing torso or use momentum."
  },
  {
    id: "ex-13",
    name: "Tricep Cable Pushdown",
    muscleGroup: "Arms",
    muscle: "Arms",
    equipment: "Cable",
    type: "strength",
    difficulty: "Beginner",
    sets: 3,
    reps: 12,
    weight: 20,
    rest: 60,
    description: "Isolates the triceps lateral and medial heads with steady cable tension.",
    instructions: [
      "Attach rope or V-bar to high cable. Pin elbows tight to sides.",
      "Extend arms down until fully straight, spreading rope ends at bottom.",
      "Return under control until forearms reach parallel to floor."
    ],
    tips: "Keep upper arms motionless; only forearms should move like a hinge."
  },
  {
    id: "ex-14",
    name: "Barbell Bicep Curls",
    muscleGroup: "Arms",
    muscle: "Arms",
    equipment: "Barbell",
    type: "strength",
    difficulty: "Beginner",
    sets: 3,
    reps: 10,
    weight: 25,
    rest: 60,
    description: "Fundamental mass-building exercise for biceps brachii and brachialis.",
    instructions: [
      "Hold bar with underhand grip, elbows pinned to sides.",
      "Curl bar up toward chest while keeping upper arms fixed.",
      "Squeeze biceps hard at top, lower slowly without body sway."
    ],
    tips: "Do not let elbows drift forward past your ribcage during the lift."
  },

  // ─── BODYWEIGHT & CALISTHENICS ──────────────────────────────────────────────
  {
    id: "ex-15",
    name: "Push-ups",
    muscleGroup: "Chest",
    muscle: "Chest",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: 15,
    weight: 0,
    rest: 60,
    description: "Classic foundational horizontal press building chest, front delts, and core endurance.",
    instructions: [
      "Place hands slightly wider than shoulders, body in a rigid straight plank.",
      "Lower chest until elbows hit 90 degrees or chest taps floor.",
      "Push floor away, finishing with shoulder blades wrapping slightly forward."
    ],
    tips: "Avoid sagging your lower back; maintain active glute and abdominal tension."
  },
  {
    id: "ex-16",
    name: "Pull-ups",
    muscleGroup: "Back",
    muscle: "Back",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: 8,
    weight: 0,
    rest: 90,
    description: "Premier vertical pulling bodyweight exercise for lat development and grip strength.",
    instructions: [
      "Grip overhead bar overhand, shoulder-width or slightly wider.",
      "Depress scapulae, pull chest towards bar until chin clears bar.",
      "Lower with full control into a full dead-hang stretch."
    ],
    tips: "Drive elbows down toward back pockets rather than yanking with arms."
  },
  {
    id: "ex-17",
    name: "Dips",
    muscleGroup: "Arms",
    muscle: "Arms",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: 10,
    weight: 0,
    rest: 90,
    description: "Heavy bodyweight press hitting triceps, lower chest, and anterior delts.",
    instructions: [
      "Mount dip bars with locked arms, shoulders packed down.",
      "Lower body by bending elbows until upper arms are parallel to floor.",
      "Press through palms to return to lockout."
    ],
    tips: "Lean torso forward slightly for chest focus; stay upright for tricep isolation."
  },
  {
    id: "ex-18",
    name: "Bodyweight Squats",
    muscleGroup: "Legs",
    muscle: "Legs",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: 20,
    weight: 0,
    rest: 45,
    description: "Foundational lower-body biomechanics builder for endurance and hip mobility.",
    instructions: [
      "Stand tall, feet shoulder-width, toes angled slightly out.",
      "Reach hips back and sit down into a deep squat below parallel.",
      "Press through heels and midfoot to return to standing position."
    ],
    tips: "Keep torso upright and drive knees gently outward."
  },
  {
    id: "ex-19",
    name: "Walking Lunges",
    muscleGroup: "Legs",
    muscle: "Legs",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: 12,
    weight: 0,
    rest: 60,
    description: "Dynamic unilateral leg movement building quads, glutes, and pelvic balance.",
    instructions: [
      "Step forward with right leg, lowering back knee until hovering above floor.",
      "Drive through front heel to step left leg forward into next lunge.",
      "Continue alternating in a continuous rhythmic stride."
    ],
    tips: "Maintain vertical torso posture without leaning forward over the knee."
  },
  {
    id: "ex-20",
    name: "Plank",
    muscleGroup: "Core",
    muscle: "Core",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: 60, // 60 seconds
    weight: 0,
    rest: 45,
    description: "Isometric core stability drill targeting the transverse abdominis and pelvic posture.",
    instructions: [
      "Rest forearms on floor with elbows directly under shoulders.",
      "Extend legs back, engaging core, glutes, and quadriceps.",
      "Hold straight line from head to heels without sagging hips."
    ],
    tips: "Squeeze glutes hard and pull belly button up toward your spine."
  },
  {
    id: "ex-21",
    name: "Hanging Leg Raises",
    muscleGroup: "Core",
    muscle: "Core",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: 12,
    weight: 0,
    rest: 60,
    description: "Advanced anterior core and hip flexor movement for a sculpted abdominal wall.",
    instructions: [
      "Hang from pull-up bar with overhand grip, shoulders engaged.",
      "Engage abs and curl pelvis up, lifting legs toward 90 degrees or higher.",
      "Lower with controlled tempo without swinging back and forth."
    ],
    tips: "Curl your hips upward at the top instead of just lifting legs with hip flexors."
  },
  {
    id: "ex-22",
    name: "Mountain Climbers",
    muscleGroup: "Core",
    muscle: "Core",
    equipment: "Bodyweight",
    type: "bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: 30,
    weight: 0,
    rest: 45,
    description: "Dynamic core and conditioning exercise that challenges shoulder stability and hip agility.",
    instructions: [
      "Start in a high push-up plank position with hands directly beneath shoulders.",
      "Drive one knee rapidly toward chest, tap toe, then alternate explosively.",
      "Maintain a flat back and steady rhythmic pace throughout."
    ],
    tips: "Keep hips down and avoid letting shoulders rock forward and backward."
  },

  // ─── CARDIO & ENDURANCE ─────────────────────────────────────────────────────
  {
    id: "ex-23",
    name: "Running",
    muscleGroup: "Cardio",
    muscle: "Cardio",
    equipment: "Treadmill",
    type: "cardio",
    difficulty: "Beginner",
    sets: 1,
    reps: 1,
    duration: 30, // 30 minutes
    distance: 4.0, // 4 km
    rest: 0,
    description: "Steady-state aerobic endurance builder to enhance cardiovascular conditioning and stamina.",
    instructions: [
      "Maintain tall posture with slight forward lean from ankles.",
      "Land softly under hips with a midfoot strike.",
      "Breathe rhythmically in sync with your running cadence."
    ],
    tips: "Keep shoulders relaxed and avoid clenching your fists while striding."
  },
  {
    id: "ex-24",
    name: "Cycling",
    muscleGroup: "Cardio",
    muscle: "Cardio",
    equipment: "Stationary Bike",
    type: "cardio",
    difficulty: "Beginner",
    sets: 1,
    reps: 1,
    duration: 35,
    distance: 12.0,
    rest: 0,
    description: "Low-impact aerobic conditioning targeting quad endurance without joint impact.",
    instructions: [
      "Adjust seat height so knee maintains a slight 5-10 degree bend at bottom stroke.",
      "Pedal with smooth circular force engaging glutes and hamstrings on upstroke.",
      "Maintain steady target cadence between 80-95 RPM."
    ],
    tips: "Keep weight balanced through pedals rather than bearing all load onto handlebars."
  },
  {
    id: "ex-25",
    name: "Jump Rope",
    muscleGroup: "Cardio",
    muscle: "Cardio",
    equipment: "Jump Rope",
    type: "cardio",
    difficulty: "Intermediate",
    sets: 4,
    reps: 1,
    duration: 15,
    distance: 0,
    rest: 60,
    description: "High-cadence plyometric conditioning that sharpens footwork, calves, and hand-eye coordination.",
    instructions: [
      "Hold rope handles at hip height with elbows bent close to ribs.",
      "Rotate rope primarily using wrists, jumping 1-2 inches off balls of feet.",
      "Land lightly with knees soft to absorb ground reaction forces."
    ],
    tips: "Jump only as high as necessary for the rope to clear under your feet."
  },
  {
    id: "ex-26",
    name: "HIIT Sprint Intervals",
    muscleGroup: "Cardio",
    muscle: "Cardio",
    equipment: "Treadmill",
    type: "cardio",
    difficulty: "Advanced",
    sets: 8,
    reps: 1,
    duration: 20,
    distance: 3.0,
    rest: 30,
    description: "High-intensity anaerobic threshold conditioning to ramp VO2 max and metabolic rate.",
    instructions: [
      "Warm up at light pace for 3-5 minutes.",
      "Sprint at 90-95% maximal effort for 30 seconds.",
      "Drop to slow recovery walk for 30 seconds.",
      "Repeat for 8 full rounds."
    ],
    tips: "Maintain upright posture and aggressive arm drive during sprint intervals."
  }
];

export const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio'
];

export const EQUIPMENT_LIST = [
  'All',
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Treadmill',
  'Stationary Bike',
  'Jump Rope'
];

export const DIFFICULTY_LEVELS = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced'
];

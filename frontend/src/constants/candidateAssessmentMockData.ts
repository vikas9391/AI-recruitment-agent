export interface McqOption {
  id: string;
  text: string;
}

export interface McqQuestion {
  id: string;
  text: string;
  options: McqOption[];
}

export interface CodingProblem {
  title: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string[];
}

export const candidateInfo = {
  name: "Ananya Rao",
  appliedJob: "Frontend Developer",
};

export const assessmentInfo = {
  id: "asmt-2026-0731",
  name: "Frontend Developer Test",
  durationMinutes: 60,
  totalQuestions: 5,
  passingScore: 70,
  instructions: [
    "This assessment contains 5 multiple-choice questions followed by one coding problem.",
    "You have 60 minutes to complete the entire assessment, including the coding section.",
    "You may navigate between questions and change your answers before submitting.",
    "Once you submit, you will not be able to make further changes.",
    "Ensure a stable internet connection throughout the assessment.",
  ],
};

export const mcqQuestions: McqQuestion[] = [
  {
    id: "q1",
    text: "Which hook is used to manage local state in a functional React component?",
    options: [
      { id: "a", text: "useEffect" },
      { id: "b", text: "useState" },
      { id: "c", text: "useContext" },
      { id: "d", text: "useRef" },
    ],
  },
  {
    id: "q2",
    text: "What does the CSS flexbox property 'justify-content: space-between' do?",
    options: [
      { id: "a", text: "Adds equal margin around each flex item" },
      { id: "b", text: "Distributes items with equal space between them, none at the edges" },
      { id: "c", text: "Centers all items in the container" },
      { id: "d", text: "Stacks items vertically" },
    ],
  },
  {
    id: "q3",
    text: "In TypeScript, which keyword is used to define a reusable object shape?",
    options: [
      { id: "a", text: "class" },
      { id: "b", text: "interface" },
      { id: "c", text: "enum" },
      { id: "d", text: "namespace" },
    ],
  },
  {
    id: "q4",
    text: "Which HTTP method is typically used to update an existing resource?",
    options: [
      { id: "a", text: "GET" },
      { id: "b", text: "POST" },
      { id: "c", text: "PUT" },
      { id: "d", text: "DELETE" },
    ],
  },
  {
    id: "q5",
    text: "What is the purpose of React's key prop when rendering lists?",
    options: [
      { id: "a", text: "It styles the list items" },
      { id: "b", text: "It helps React identify which items changed, were added, or removed" },
      { id: "c", text: "It sets the list's accessibility label" },
      { id: "d", text: "It defines the sort order of the list" },
    ],
  },
];

export const codingProblem: CodingProblem = {
  title: "Two Sum",
  description:
    "Given an array of integers and a target value, return the indices of the two numbers that add up to the target. Assume each input has exactly one solution, and the same element cannot be used twice.",
  sampleInput: "nums = [2, 7, 11, 15], target = 9",
  sampleOutput: "[0, 1]",
  constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
};

export const languageOptions = ["Java", "Python", "JavaScript", "C++"] as const;
export type Language = (typeof languageOptions)[number];

export const starterCode: Record<Language, string> = {
  Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // write your solution here\n    }\n}`,
  Python: `def two_sum(nums, target):\n    # write your solution here\n    pass`,
  JavaScript: `function twoSum(nums, target) {\n  // write your solution here\n}`,
  "C++": `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // write your solution here\n    }\n};`,
};
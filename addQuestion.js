import { collection, addDoc } from "firebase/firestore";
import { db } from "./src/components/firebase.js";

const questions = [
  {
    cat: "DWDM",
    q: "A Data Warehouse is:",
    options: ["OLTP system", "Subject-oriented, integrated, time-variant, non-volatile collection of data", "Operational database", "Distributed file system"],
    a: 1
  },
  {
    cat: "DWDM",
    q: "The top-down approach for data warehouse design was proposed by:",
    options: ["Inmon", "Kimball", "Codd", "Chen"],
    a: 0
  },
  {
    cat: "DWDM",
    q: "The bottom-up approach was suggested by:",
    options: ["Inmon", "Kimball", "Date", "Gray"],
    a: 1
  },
  {
    cat: "DWDM",
    q: "Metadata in a Data Warehouse is used to:",
    options: ["Store user queries", "Store data about data", "Compress data", "Clean data"],
    a: 1
  },
  {
    cat: "DWDM",
    q: "Which is a subset of Data Warehouse?",
    options: ["OLTP", "Data Mart", "Metadata", "Database view"],
    a: 1
  },
  {
    cat: "DWDM",
    q: "ETL stands for:",
    options: ["Extract, Transform, Load", "Execute, Transfer, Load", "Extract, Transfer, Link", "Evaluate, Transform, Load"],
    a: 0
  },
  {
    cat: "DWDM",
    q: "Fact tables in a Data Warehouse contain:",
    options: ["Dimensions", "Transactions or measures", "User data", "Metadata"],
    a: 1
  },
  {
    cat: "DWDM",
    q: "Which schema is widely used in data warehousing?",
    options: ["Star schema", "Snowflake schema", "Both", "None"],
    a: 2
  },
  {
    cat: "DWDM",
    q: "Data Warehouse is mainly used for:",
    options: ["Operational processing", "Analytical processing", "Real-time transactions", "Networking"],
    a: 1
  },
  {
    cat: "DWDM",
    q: "A slowly changing dimension (SCD) is:",
    options: ["A rapidly changing field", "A field that changes infrequently", "A type of fact table", "ETL process"],
    a: 1
  }
];

const addQuestions = async () => {
  for (const q of questions) {
    try {
      const docRef = await addDoc(collection(db, "questions"), q);
      console.log("Question added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding question: ", e);
    }
  }
};

addQuestions();

// context/ExamineeContext.js
import { createContext, useContext, useState } from "react";

// Create the context
export const ExamineeContext = createContext();


export const ExamineeProvider = ({ children }) => {
    const [examineeAttemptExamCode, setExamineeAttemptExamCode] = useState("");
    const [examineeAttemptExam, setExamineeAttemptExam] = useState("")


    return (
        <ExamineeContext.Provider
            value={{
                examineeAttemptExamCode,
                setExamineeAttemptExamCode,
                examineeAttemptExam,
                setExamineeAttemptExam,
            }}
        >
            {children}
        </ExamineeContext.Provider>
    );
};

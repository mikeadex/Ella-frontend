import React, { useState } from "react";
import CVUpload from "../components/CVParser/CVUpload";
import ParsedCV from "../components/CVParser/ParsedCV";

const CVParserPage = () => {
    const [parsedData, setParsedData] = useState(null);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-8">CV Parser</h1>
            <CVUpload onParseSuccess={setParsedData} />
            <ParsedCV data={parsedData} />
        </div>
    );
};

export default CVParserPage;

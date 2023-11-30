/*import pdfParse from 'pdf-parse';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const parsePDF = async (buffer) =>
{
    const data = await pdfParse(buffer);
    return data.text;
};

const analyzeText = (cvText, jobText) =>
{
    const cvWords = cvText.toLowerCase().split(/\s+/);
    const jobWords = jobText.toLowerCase().split(/\s+/);

    const commonWords = cvWords.filter(word => jobWords.includes(word));

    const matchingPercentage = (commonWords.length / cvWords.length) * 100;

    return matchingPercentage;
};

const matchAnalysis = (cvText, jobText) =>
{
    const matchingPercentage = analyzeText(cvText, jobText);

    if (matchingPercentage > 90)
    {
        return "Perfect Match";
    } else if (matchingPercentage > 40)
    {
        return "Candidate Eligible to Pass";
    } else
    {
        return "Candidate Under Qualified";
    }
};

export const matchCVToJob = async (req, res, next) =>
{
    try
    {
        const cvBuffer = req.file.buffer;
        const cvText = await parsePDF(cvBuffer);
        const jobText = req.body.jobText;

        const result = matchAnalysis(cvText, jobText);
        res.json({ result });
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
*/
import mongoose from "mongoose";



const StatusEnum = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};
const applicationsSchema = new mongoose.Schema(

    {
        candidateName: {
            type: String,
            required: [true]
        },
        candidateSurname: {
            type: String,
            required: [true]
        },
        linkedinProfile: {
            type: String,
        },
        email: {
            type: String,
            required: [true]
        },
        coverLetter:
        {
            type: String,
        },
        pdf: {
            type: String,
            required: [true]

        },
        status: {
            type: String,
            enum: Object.values(StatusEnum),
            default: StatusEnum.PENDING,

        }
    },
    {
        timestamps: true,
    }
);

class Status
{
    static get PENDING()
    {
        return StatusEnum.PENDING;
    }

    static get APPROVED()
    {
        return StatusEnum.APPROVED;
    }

    static get REJECTED()
    {
        return StatusEnum.REJECTED;
    }
}


const ApplicationsModel = mongoose.model("Applications", applicationsSchema);
export default ApplicationsModel;
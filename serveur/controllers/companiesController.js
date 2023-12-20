import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import { response } from "express";
import userOTPverification from "../models/userOTPverificationModel.js"
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";



export const register = async (req, res, next) =>
{
  const { name, email, password } = req.body;

  // validate fields
  if (!name)
  {
    next("Company Name is required!");
    return;
  }
  if (!email)
  {
    next("Email address is required!");
    return;
  }
  if (!password)
  {
    next("Password is required and must be greater than 6 characters");
    return;
  }

  try
  {
    // create a new account
    const company = await Companies.create({
      name,
      email,
      password,
      verified: false,
    });
    const _id = company._id
    // send otp
    const otpStatus = await sendOTPVerificationEmail({ _id, email }, res);



    // user token
    const token = company.createJWT();

    // verify OTP
    const otpVerificationResult = await verifyOTP({ userId: company._id, otp: otpStatus.data.otp }, res);

    if (otpVerificationResult.status === "FAILED")
    {
      // handle OTP verification failure, you can delete the created company or take appropriate action
      await Companies.findByIdAndDelete(company._id);
      res.status(200).json(otpVerificationResult);
      return;
    }

    res.status(201).json({
      success: true,
      message: "Company Account Created Successfully",
      user: {
        _id: company._id,
        name: company.name,
        email: company.email,
        verified: company.verified,
      },
      token,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


const sendOTPVerificationEmail = async ({ _id, email }, res) =>
{
  //nodemailer
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try
  {
    //number of 4 digits
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Enter <b>${otp} </b> in the app to verify your email address and complete the registration. This OTP will expire in 1 hour </p>`,
    };

    //hash otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPverification = await new userOTPverification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 360000000,

    });
    //save OTP record
    await newOTPverification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,


      }
    });
  } catch (error)
  {
    res.json({
      status: "FAILED",
      message: error.message,

    });

  }
}

export const verifyOTP = async (req, res) =>
{
  try
  {
    let { userId, otp } = req.body;
    if (!userId || !otp)
    {
      throw Error("Empty OTP details are not allowed");
    } else
    {
      const UserOTPVerificationRecords = await userOTPverification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0)
      {
        // no record found
        throw new Error("Account record doesn't exist or has been verified already. Please sign up again or login");
      } else
      {
        // OTP exists
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now())
        {
          // user OTP expired
          userOTPverification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else
        {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP)
          {
            throw new Error("Invalid code passed. Check your inbox.");
          } else
          {
            // Assuming Companies is the correct model, update it accordingly
            await Companies.updateOne({ _id: userId }, { verified: true });
            await userOTPverification.deleteMany({ userId });
            res.json({
              status: "VERIFIED",
              message: `User email verified successfully`,
            });
          }
        }
      }
    }
  } catch (error)
  {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};



export const signIn = async (req, res, next) =>
{
  const { email, password } = req.body;

  try
  {
    //validation
    if (!email || !password)
    {
      next("Please Provide AUser Credentials");
      return;
    }

    const company = await Companies.findOne({ email }).select("+password");

    if (!company)
    {
      next("Invalid email or Password");
      return;
    }

    //compare password
    const isMatch = await company.comparePassword(password);
    if (!isMatch)
    {
      next("Invalid email or Password");
      return;
    }
    company.password = undefined;

    const token = company.createJWT();

    res.status(200).json({
      success: true,
      message: "Login SUccessfully",
      user: company,
      token,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res, next) =>
{
  const { name, contact, location, profileUrl, about } = req.body;

  try
  {
    // validation
    if (!name || !location || !about || !contact || !profileUrl)
    {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    const token = company.createJWT();

    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company Profile Updated SUccessfully",
      company,
      token,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyProfile = async (req, res, next) =>
{
  try
  {
    const id = req.body.user.userId;

    const company = await Companies.findById({ _id: id });

    if (!company)
    {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET ALL COMPANIES
export const getCompanies = async (req, res, next) =>
{
  try
  {
    const { search, sort, location } = req.query;

    //conditons for searching filters
    const queryObject = {};

    if (search)
    {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location)
    {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Companies.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest")
    {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest")
    {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z")
    {
      queryResult = queryResult.sort("name");
    }
    if (sort === "Z-A")
    {
      queryResult = queryResult.sort("-name");
    }

    // PADINATIONS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Companies.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);
    // move next page
    // queryResult = queryResult.skip(skip).limit(limit);

    // show mopre instead of moving to next page
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET  COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) =>
{
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try
  {
    //conditons for searching filters
    const queryObject = {};

    if (search)
    {
      queryObject.location = { $regex: search, $options: "i" };
    }

    let sorting;
    //sorting || another way
    if (sort === "Newest")
    {
      sorting = "-createdAt";
    }
    if (sort === "Oldest")
    {
      sorting = "createdAt";
    }
    if (sort === "A-Z")
    {
      sorting = "name";
    }
    if (sort === "Z-A")
    {
      sorting = "-name";
    }

    let queryResult = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sorting },
    });
    const companies = await queryResult;

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// GET SINGLE COMPANY
export const getCompanyById = async (req, res, next) =>
{
  try
  {
    const { id } = req.params;

    const company = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: "-_id",
      },
    });

    if (!company)
    {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error)
  {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

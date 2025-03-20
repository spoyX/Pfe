const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const transporter = require('../../config/email')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY )

exports.createAdminAccount = async () => {

    try {

        let existAdmin = await User.find({ role: 'admin' });
        if (existAdmin.length == 0) {

            let data = {

                username: 'ADMIN ADMIN',
                email: process.env.EMAIL,
                password: process.env.PASS,
                
                phone: process.env.PHONE,
                role: 'admin',
                
                

            }

            let admin = new User(data);
            admin.password = bcrypt.hashSync(data.password, 10);

            await admin.save();
            console.log('admin created , you can use the application now !');

        } else {
            console.log('admin already exist');
        }

    } catch (error) {
        console.log(error);
    }




}

exports.createUserAccount = async (req, res, fileName) => {
  try {
    // Extract fields from request body
    const { 
      username, 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      dateOfBirth,
      gender
     
    } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user object
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      gender,
    
      idType: fileName, // Store the uploaded file name
      status: 'inactive' // Default status is inactive
    });

    // Save user to database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ 
      message: 'User account created successfully. Please complete your profile to activate.',
      user: newUser
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
      

    const user = await User.findOne({ email });
      if (!user) 
          return res.status(401).json({ message: 'Invalid email or password' });
      
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if account is active
      if (user.status !== 'active') {
          return res.status(403).json({ message: 'Account is not active' });
      }

      let payload = {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          role: user.role,
          aboutMe:user.aboutMe,
          gender:user.gender,
          country:user.country,
          city:user.city,
          dateOfBirth:user.dateOfBirth,
          status: user.status,
          createdAt: user.createdAt,
          firstName: user.firstName,
          lastName: user.lastName
      };

      let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

      res.status(200).send({ myToken: token });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
}


// GET /api/profile/:id
exports.getUserProfile = async (req, res) => {
  try {
    // Extract userId from URL params
    const userId = req.params.id;

    // Find user in the database, excluding the password
    let user = await User.findById({ _id: req.params.id }, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res,fileName) => {
  try {
    // Assume userId is provided in URL params (or you can extract it from the token)
    const userId = req.params.id;

    // Destructure only the fields that are allowed to be updated
    const { username, firstName, lastName, email, phone, gender, job, aboutMe, country, city ,facebookLink,instagramLink,linkedinLink} = req.body;

    // Build the update object
    const updateData = {};
    if (username) updateData.username = username;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (job) updateData.job = job;
   if(facebookLink) updateData.facebookLink=facebookLink;
   if(instagramLink) updateData.instagramLink=instagramLink;
   if(linkedinLink) updateData.linkedinLink=linkedinLink;


   
    if (aboutMe) updateData.aboutMe = aboutMe;
    if (country) updateData.country = country;
    if (city) updateData.city = city;

    // If a file is uploaded, update the profile image
    if (req.file) {
      updateData.profileImage = req.file.filename; // Multer attaches the file info here
    }

  
    let updatedUser = await User.findByIdAndUpdate( {_id:userId}, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { currentPassword, newPassword } = req.body;


    

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate a random verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code via email
async function sendVerificationCode(email, code) {
  try {
    await transporter.sendMail({
      from: 'adembenchiboub74@gmail.com',
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is: ${code}`,
      html: `<table align="center" width="600" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="background-color: #007bff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff;">Membra</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 20px;">
                  <p style="margin: 0; font-size: 16px; color: #333; line-height: 1.5;">Hello,</p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px;">
                  <p style="margin: 0; font-size: 16px; color: #333; line-height: 1.5;">
                    You have requested to reset your password. Please use the following verification code to proceed:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <div style="display: inline-block; padding: 10px 20px; background-color: #e9f5ff; border: 1px solid #007bff; border-radius: 5px;">
                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #007bff;">${code}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px;">
                  <p style="margin: 0; font-size: 16px; color: #333; line-height: 1.5;">
                    Enter this code on the password reset page to continue. This code will expire in 15 minutes.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">
              If you did not request a password reset, please ignore this email or <a href="https://example.com/support" style="color: #007bff; text-decoration: none;">contact support</a>.
            </p>
            <p style="margin: 10px 0 0;">Company Name, 123 Street, City, Country</p>
          </td>
        </tr>
      </table>`
    });
    console.log('Verification code sent');
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
}

// Initiate password reset process
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Update user with verification code and expiration time (1 hour)
    user.verificationCode = verificationCode;
    user.codeExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    // Send verification code via email
    await sendVerificationCode(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Function to check if the verification code is valid
exports.checkVerificationCode = async (req, res) => {
  try {
    
    const { verificationCode } = req.body;

    
    

  

    // Check if the verification code matches and is not expired
    if (User.verificationCode !== verificationCode || User.codeExpires < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired verification code' });
    }

    // If code is valid, respond with success
    res.status(200).json({ message: 'Verification code is valid' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Reset password with verification code
exports.resetPassword = async (req, res) => {
  try {
    const {   email ,newPassword } = req.body;
    

    
  

  

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'wrong email' });
    }
    

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update password and clear verification data
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.codeExpires = undefined;
  


    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendContactMessage = async (req, res) => {
  try {
    // Extract all fields from request body
    const { 
      firstName, 
      lastName, 
      company, 
      jobTitle, 
      email, 
      phone, 
      country, 
      subject, 
      message 
    } = req.body;

    // Construct full name
    const fullName = `${firstName} ${lastName}`;

    // Use the transporter to send the email
    await transporter.sendMail({
      from: email, // Consider using a fixed sender address if needed
      to: 'adembenchiboub74@gmail.com', // Replace with your contact email
      subject: subject,
      text: `
        Message from ${fullName} (${email}):
        
        ${message}
        
        Additional Information:
        Company: ${company}
        Job Title: ${jobTitle}
        Phone: ${phone}
        Country: ${country}
      `,
      html: `
        <p>Message from <strong>${fullName}</strong> (<a href="mailto:${email}">${email}</a>):</p>
        <p>${message}</p>
        
        <h4>Additional Information:</h4>
        <ul>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Job Title:</strong> ${jobTitle}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Country:</strong> ${country}</li>
        </ul>
      `
    });

    res.status(200).json({ 
      message: 'Your message has been sent successfully.' 
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};



const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


exports.createAdminAccount = async () => {

    try {

        let existAdmin = await User.find({ role: 'admin' });
        if (existAdmin.length == 0) {

            let data = {

                username: 'ADMIN ADMIN',
                email: process.env.EMAIL,
                password: process.env.PASS,
                image: 'admin.png',
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

const signIn = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

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
          status: user.status,
          createdAt: user.createdAt,
          firstName: user.firstName,
          lastName: user.lastName
      };

      let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ token, user: payload });
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

exports.updateProfile = async (req, res) => {
  try {
    // Assume userId is provided in URL params (or you can extract it from the token)
    const userId = req.params.id;

    // Destructure only the fields that are allowed to be updated
    const { username, firstName, lastName, email, phone, gender, job, aboutMe, country, city } = req.body;

    // Build the update object
    const updateData = {};
    if (username) updateData.username = username;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (job) updateData.job = job;
    if (aboutMe) updateData.aboutMe = aboutMe;
    if (country) updateData.country = country;
    if (city) updateData.city = city;

    // If a file is uploaded, update the profile image
    if (req.file) {
      updateData.profileImage = req.file.filename; // Multer attaches the file info here
    }

    // Update the user (using new: true to return the updated document)
    let updatedUser = await User.findByIdAndUpdate( userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { 
      username, 
      firstName, 
      lastName, 
      email, 
      phone, 
      gender, 
      job, 
      aboutMe, 
      country, 
      city 
    } = req.body;

    const updateData = Object.fromEntries(
      Object.entries({
        username,
        firstName,
        lastName,
        email,
        phone,
        gender,
        job,
        aboutMe,
        country,
        city
      }).filter(([key, value]) => value !== undefined)
    );

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, updateData, { new: true });
    
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
    const userId = req.user._id; 
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




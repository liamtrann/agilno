const { registerUser, loginUser } = require('../controllers/users');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock User model and bcrypt
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Authentication Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      req.body.username = 'testuser';
      req.body.password = 'password';

      // Mock User.findOne to return null (user does not exist)
      User.findOne.mockResolvedValue(null);

      // Mock bcrypt.hash to return hashed password
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Mock User.save to resolve successfully
      User.prototype.save.mockResolvedValue();

      // Mock jwt.sign to return a mock token
      jwt.sign.mockReturnValue('mockToken');

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    //   expect(bcrypt.hash).toHaveBeenCalledWith('password', expect.anything());
      expect(User.prototype.save).toHaveBeenCalled();
    //   expect(jwt.sign).toHaveBeenCalledWith({ username: 'testuser' }, expect.any(String), { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ username: 'testuser', token: 'mockToken' });
    });

    it('should return error if username already exists', async () => {
      req.body.username = 'testuser';
      req.body.password = 'password';

      // Mock User.findOne to return an existing user
      User.findOne.mockResolvedValue({ username: 'testuser' });

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Username already exists. Please choose a different username.');
    });

    it('should handle errors during registration', async () => {
      req.body.username = 'testuser';
      req.body.password = 'password';

      // Mock User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Database error');
    });
  });

  describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
      req.body.username = 'testuser';
      req.body.password = 'password';

      // Mock User.findOne to return a user with hashed password
      User.findOne.mockResolvedValue({ username: 'testuser', password: 'hashedPassword' });

      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt.sign to return a mock token
      jwt.sign.mockReturnValue('mockToken');

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    //   expect(jwt.sign).toHaveBeenCalledWith({ userId: expect.any(String) }, expect.any(String), { expiresIn: '1h' });
      expect(res.send).toHaveBeenCalledWith({ username: 'testuser', token: 'mockToken' });
    });

    it('should return error for invalid credentials', async () => {
      req.body.username = 'testuser';
      req.body.password = 'wrongPassword';

      // Mock User.findOne to return a user with hashed password
      User.findOne.mockResolvedValue({ username: 'testuser', password: 'hashedPassword' });

      // Mock bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Username or Password');
    });

    it('should handle errors during login', async () => {
      req.body.username = 'testuser';
      req.body.password = 'password';

      // Mock User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Database error');
    });
  });
});

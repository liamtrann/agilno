const {
  createEvent,
  listEvents,
  getEventById,
  registerForEvent,
} = require("../controllers/events");
const Event = require("../models/Event");

jest.mock("../models/Event");

describe("Event Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe("createEvent", () => {
    it("should create an event successfully", async () => {
      req.body = {
        name: "Test Event",
        date: new Date(),
        capacity: 100,
        username: "testuser",
      };

      const saveMock = jest.fn().mockResolvedValue({});
      Event.mockImplementation(() => ({ save: saveMock }));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith("Event created successfully");
    });

    it("should return a 400 error if there is a database error", async () => {
      req.body = {
        name: "Test Event",
        date: new Date(),
        capacity: 100,
        username: "testuser",
      };

      const saveMock = jest.fn().mockRejectedValue(new Error("Database error"));
      Event.mockImplementation(() => ({ save: saveMock }));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });

  describe("listEvents", () => {
    it("should list all events", async () => {
      const events = [{ name: "Test Event" }];
      Event.find.mockResolvedValue(events);

      await listEvents(req, res);

      expect(res.send).toHaveBeenCalledWith(events);
    });

    it("should return a 400 error if there is a database error", async () => {
      Event.find.mockRejectedValue(new Error("Database error"));

      await listEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });

  describe("getEventById", () => {
    it("should return an event by ID", async () => {
      const event = { name: "Test Event" };
      req.params.id = "123";
      Event.findById.mockResolvedValue(event);

      await getEventById(req, res);

      expect(res.send).toHaveBeenCalledWith(event);
    });

    it("should return a 400 error if there is a database error", async () => {
      req.params.id = "123";
      const error = new Error("Database error");
      Event.findById.mockRejectedValue(error);

      await getEventById(req, res);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching event:",
        error
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });

  describe("registerForEvent", () => {
    it("should register a user for an event", async () => {
      const event = {
        date: new Date(Date.now() + 86400000),
        capacity: 100,
        registrations: [],
        save: jest.fn().mockResolvedValue({}),
      };
      req.body.username = "testuser";
      req.params.id = "123";
      Event.findById.mockResolvedValue(event);

      await registerForEvent(req, res);

      expect(res.send).toHaveBeenCalledWith("Registered successfully");
    });

    it("should return a 404 error if event is not found", async () => {
      req.params.id = "123";
      Event.findById.mockResolvedValue(null);

      await registerForEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Event not found");
    });

    it("should return a 400 error if event is full", async () => {
      const event = {
        date: new Date(Date.now() + 86400000),
        capacity: 1,
        registrations: ["user1"],
        save: jest.fn().mockResolvedValue({}),
      };
      req.body.username = "testuser";
      req.params.id = "123";
      Event.findById.mockResolvedValue(event);

      await registerForEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Event is full");
    });

    it("should return a 400 error if user is already registered", async () => {
      const event = {
        date: new Date(Date.now() + 86400000),
        capacity: 100,
        registrations: ["testuser"],
        save: jest.fn().mockResolvedValue({}),
      };
      req.body.username = "testuser";
      req.params.id = "123";
      Event.findById.mockResolvedValue(event);

      await registerForEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("User already registered");
    });

    it("should return a 400 error if there is a database error", async () => {
      req.params.id = "123";
      const error = new Error("Database error");
      Event.findById.mockRejectedValue(error);

      await registerForEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });
});

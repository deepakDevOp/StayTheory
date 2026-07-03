import api from "./api";

export const publicService = {
  // Properties
  getProperties: async (params: any = {}) => {
    const response = await api.get("/properties/", { params });
    return response.data;
  },
  
  getPropertyBySlug: async (slug: string) => {
    const response = await api.get(`/properties/${slug}`);
    return response.data;
  },
  
  getAmenities: async () => {
    const response = await api.get("/properties/amenities");
    return response.data;
  },
  
  getSimilarProperties: async (id: string) => {
    const response = await api.get(`/properties/${id}/similar`);
    return response.data;
  },

  // Bookings
  createBooking: async (data: any) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },
  
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },
  
  getBlockedDates: async (propertyId: string) => {
    const response = await api.get(`/bookings/property/${propertyId}/booked-dates`);
    return response.data;
  },

  // Reviews
  getPropertyReviews: async (propertyId: string) => {
    const response = await api.get(`/reviews/property/${propertyId}`);
    return response.data;
  },

  getAllReviews: async () => {
    const response = await api.get("/reviews/all");
    return response.data;
  },
  
  submitReview: async (data: any) => {
    const response = await api.post("/reviews", data);
    return response.data;
  }
};

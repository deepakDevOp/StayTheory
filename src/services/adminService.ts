import api from "./api";

export const adminService = {
  // Dashboard Snapshot
  getSnapshot: async () => {
    const response = await api.get(`/dashboard/snapshot?t=${Date.now()}`);
    return response.data;
  },

  // Properties
  getProperties: async () => {
    const response = await api.get("/properties/admin/all");
    return response.data;
  },
  
  createProperty: async (data: any) => {
    const response = await api.post("/properties", data);
    return response.data;
  },
  
  updateProperty: async (id: string, data: any) => {
    const response = await api.patch(`/properties/${id}`, data);
    return response.data;
  },
  
  deleteProperty: async (id: string) => {
    await api.delete(`/properties/${id}`);
  },

  // Bookings
  getAllBookings: async () => {
    const response = await api.get("/bookings/admin/all");
    return response.data;
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.patch(`/bookings/${id}/status`, null, {
      params: { new_status: status }
    });
    return response.data;
  },

  // Reviews
  getAllReviews: async () => {
    const response = await api.get("/reviews/admin/all");
    return response.data;
  },
  
  approveReview: async (id: string) => {
    const response = await api.patch(`/reviews/${id}`, { is_approved: true });
    return response.data;
  },
  
  deleteReview: async (id: string) => {
    await api.delete(`/reviews/${id}`);
  },

  createReview: async (data: any) => {
    const response = await api.post("/reviews/admin/create", data);
    return response.data;
  },

  // Media
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // CMS / Home Page Management
  getCMSContent: async () => {
    const response = await api.get("/cms/home");
    return response.data;
  },

  updateCMSContent: async (sectionKey: string, data: any) => {
    const response = await api.patch(`/cms/home/${sectionKey}`, data);
    return response.data;
  }
};

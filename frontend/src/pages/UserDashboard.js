import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, LogOut, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API } from '../App';
const React = require('react');
const { AuthContext } = require('../App');

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.booking_date) < new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F0E9] via-[#FAFAF9] to-[#E8ECE6]">
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-24 py-6 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading">My Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              data-testid="new-booking-btn"
              onClick={() => navigate('/book')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
            <Button
              data-testid="logout-btn"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 lg:px-24 py-12">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Bookings */}
            <div data-testid="upcoming-bookings-section">
              <h2 className="text-2xl font-bold font-heading mb-6">Upcoming Bookings</h2>
              {upcomingBookings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-12 text-center border border-border/50"
                >
                  <p className="text-muted-foreground mb-4">You don't have any upcoming bookings</p>
                  <Button
                    data-testid="book-first-service-btn"
                    onClick={() => navigate('/book')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    Book Your First Service
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      data-testid={`booking-card-${booking.id}`}
                      className="bg-white rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg font-heading">{booking.service_name}</h3>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {booking.booking_date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {booking.booking_time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {booking.address}
                        </div>
                      </div>

                      <Button
                        data-testid={`cancel-booking-btn-${booking.id}`}
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="w-full rounded-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div data-testid="past-bookings-section">
                <h2 className="text-2xl font-bold font-heading mb-6">Past Bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/50 rounded-2xl border border-border/50 p-6"
                    >
                      <div className="mb-4">
                        <h3 className="font-semibold font-heading">{booking.service_name}</h3>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-gray-100 text-gray-700">
                          Completed
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {booking.booking_date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {booking.booking_time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
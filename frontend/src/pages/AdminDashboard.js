import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, LogOut, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { API, AuthContext } from '../App';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied');
      navigate('/dashboard');
      return;
    }
    fetchAllBookings();
  }, [user]);

  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API}/bookings/${bookingId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully');
      fetchAllBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F0E9] via-[#FAFAF9] to-[#E8ECE6]">
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-24 py-6 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage all bookings</p>
          </div>
          <Button
            data-testid="admin-logout-btn"
            variant="ghost"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 lg:px-24 py-12">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Bookings</div>
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
              </div>
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <div className="text-sm text-muted-foreground mb-2">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <div className="text-sm text-muted-foreground mb-2">Confirmed</div>
                <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
              </div>
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <div className="text-sm text-muted-foreground mb-2">Completed</div>
                <div className="text-3xl font-bold text-gray-600">{stats.completed}</div>
              </div>
            </div>

            {/* Bookings List */}
            <div>
              <h2 className="text-2xl font-bold font-heading mb-6">All Bookings</h2>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-border/50">
                  <p className="text-muted-foreground">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      data-testid={`admin-booking-${booking.id}`}
                      className="bg-white rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-3">
                          <div className="text-sm text-muted-foreground mb-1">Service</div>
                          <div className="font-semibold">{booking.service_name}</div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                          <div className="text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {booking.booking_date}
                          </div>
                          <div className="text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.booking_time}
                          </div>
                        </div>
                        
                        <div className="md:col-span-3">
                          <div className="text-sm text-muted-foreground mb-1">Customer</div>
                          <div className="text-sm flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {booking.user_name}
                          </div>
                          <div className="text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.user_email}
                          </div>
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {booking.phone}
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="text-sm text-muted-foreground mb-1">Location</div>
                          <div className="text-sm flex items-start gap-1">
                            <MapPin className="w-3 h-3 mt-0.5" />
                            <span className="line-clamp-2">{booking.address}</span>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="text-sm text-muted-foreground mb-1">Status</div>
                          <Select
                            defaultValue={booking.status}
                            onValueChange={(value) => handleStatusChange(booking.id, value)}
                          >
                            <SelectTrigger data-testid={`status-select-${booking.id}`} className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="text-sm text-muted-foreground mb-1">Notes</div>
                          <div className="text-sm">{booking.notes}</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
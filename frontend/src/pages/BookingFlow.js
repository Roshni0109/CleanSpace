import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, FileText, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { API } from '../App';

const steps = ['Select Service', 'Date & Time', 'Details', 'Confirm'];

export default function BookingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    service_id: '',
    service_name: '',
    booking_date: '',
    booking_time: '',
    address: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const handleServiceSelect = (service) => {
    setBookingData({
      ...bookingData,
      service_id: service.id,
      service_name: service.name
    });
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep === 1 && (!bookingData.booking_date || !bookingData.booking_time)) {
      toast.error('Please select date and time');
      return;
    }
    if (currentStep === 2 && (!bookingData.address || !bookingData.phone)) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking confirmed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === bookingData.service_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F0E9] via-[#FAFAF9] to-[#E8ECE6] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/dashboard')}
          className="mb-6"
          data-testid="booking-back-btn"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-12"
        >
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    index <= currentStep ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground'
                  }`}>
                    {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className={`text-sm mt-2 font-medium ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 0: Select Service */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Select a Service</h2>
              <p className="text-muted-foreground mb-8">Choose the cleaning service that fits your needs</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    data-testid={`service-option-${service.id}`}
                    onClick={() => handleServiceSelect(service)}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white border border-border/50 p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="mb-4">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-40 object-cover rounded-xl"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 font-heading">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">${service.price}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration_minutes}min
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Date & Time */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Select Date & Time</h2>
              <p className="text-muted-foreground mb-8">Choose when you'd like your cleaning service</p>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    data-testid="booking-date-input"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.booking_date}
                    onChange={(e) => setBookingData({ ...bookingData, booking_date: e.target.value })}
                    className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                  />
                </div>

                <div>
                  <Label htmlFor="time" className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    data-testid="booking-time-input"
                    type="time"
                    required
                    value={bookingData.booking_time}
                    onChange={(e) => setBookingData({ ...bookingData, booking_time: e.target.value })}
                    className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                  />
                </div>
              </div>

              <Button
                data-testid="booking-next-btn-1"
                onClick={handleNext}
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-semibold"
              >
                Continue
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Your Details</h2>
              <p className="text-muted-foreground mb-8">Provide your contact information and address</p>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    data-testid="booking-address-input"
                    type="text"
                    required
                    value={bookingData.address}
                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                    className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    data-testid="booking-phone-input"
                    type="tel"
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="h-12 bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-foreground/80 mb-2 block flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    data-testid="booking-notes-input"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    className="bg-white/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all"
                    placeholder="Any specific instructions or areas to focus on..."
                    rows={4}
                  />
                </div>
              </div>

              <Button
                data-testid="booking-next-btn-2"
                onClick={handleNext}
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-semibold"
              >
                Continue
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Confirm Your Booking</h2>
              <p className="text-muted-foreground mb-8">Please review your booking details</p>
              
              <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Service</div>
                  <div className="font-semibold text-lg">{selectedService?.name}</div>
                  <div className="text-sm text-muted-foreground">${selectedService?.price}</div>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {bookingData.booking_date}
                  </div>
                  <div className="font-semibold flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    {bookingData.booking_time}
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  <div className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {bookingData.address}
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="text-sm text-muted-foreground mb-1">Contact</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {bookingData.phone}
                  </div>
                </div>
                {bookingData.notes && (
                  <div className="border-t border-border/50 pt-4">
                    <div className="text-sm text-muted-foreground mb-1">Notes</div>
                    <div className="text-sm">{bookingData.notes}</div>
                  </div>
                )}
              </div>

              <Button
                data-testid="booking-confirm-btn"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-8 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-full font-semibold text-lg shadow-xl"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
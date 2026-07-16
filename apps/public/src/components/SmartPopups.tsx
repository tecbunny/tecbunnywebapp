'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@tecbunny/ui';
import { Button, Input } from '@tecbunny/ui';
import { TrackingContext } from './TrackingProvider';

export function SmartPopups() {
  const [showExitIntent, setShowExitIntent] = React.useState(false);
  const [showEngagement, setShowEngagement] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const { trackEvent } = React.useContext(TrackingContext);

  React.useEffect(() => {
    // 2-minute engagement timer
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('seen_engagement_popup');
      if (!hasSeen) {
        setShowEngagement(true);
        trackEvent('popup_shown', { type: 'engagement' });
        localStorage.setItem('seen_engagement_popup', 'true');
      }
    }, 120000); // 120 seconds

    // Exit intent listener
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const hasSeen = localStorage.getItem('seen_exit_popup');
        if (!hasSeen) {
          setShowExitIntent(true);
          trackEvent('popup_shown', { type: 'exit_intent' });
          localStorage.setItem('seen_exit_popup', 'true');
        }
      }
    };
    
    document.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [trackEvent]);

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    trackEvent('lead_captured_popup', { type, phone });
    // In real app, call API to save lead
    if (type === 'engagement') setShowEngagement(false);
    if (type === 'exit') setShowExitIntent(false);
  };

  return (
    <>
      {/* Exit Intent Popup */}
      <Dialog open={showExitIntent} onOpenChange={setShowExitIntent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Wait! Don't leave empty-handed.</DialogTitle>
            <DialogDescription>
              Get a FREE Consultation and Site Survey for your security needs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, 'exit')} className="space-y-4 pt-4">
            <Input 
              placeholder="Enter your WhatsApp Number" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Get Free Consultation</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Engagement Popup */}
      <Dialog open={showEngagement} onOpenChange={setShowEngagement}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Need a Custom Solution?</DialogTitle>
            <DialogDescription>
              You've been looking around. Our experts can design the perfect IT/CCTV architecture for you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, 'engagement')} className="space-y-4 pt-4">
            <Input 
              placeholder="Enter your Mobile Number" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Request Callback</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

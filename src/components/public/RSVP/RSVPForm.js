/**
 * ============================================================================
 * FILE: RSVPForm.js
 * LOCATION: src/components/public/RSVP/RSVPForm.js
 * PURPOSE: RSVP form component for wedding guests to submit their attendance
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is a React component that displays a comprehensive RSVP form for wedding
 * guests. It collects all necessary information including:
 * - Guest contact information (name, email, phone)
 * - Attendance confirmation (yes/no)
 * - Guest information (bringing a plus-one)
 * - Dietary restrictions (multiple checkboxes)
 * - Accommodation needs
 * - Song requests for the reception
 * 
 * The form validates the data and submits it to the MongoDB database via the
 * /api/rsvps API endpoint.
 * 
 * DEPENDENCIES:
 * =============
 * React Hooks:
 * - useState: For managing form state and UI state
 *   Location: 'react'
 * 
 * Next.js Components:
 * - Image: For optimized image loading (icons)
 *   Location: 'next/image'
 * 
 * API Endpoint:
 * - POST /api/rsvps: Submits RSVP data to MongoDB
 *   Location: src/pages/api/rsvps/index.js
 * 
 * Data Model:
 * - RSVP Schema: Defines the structure of RSVP data
 *   Location: src/models/Rsvp.js
 * 
 * Assets:
 * - Icon images: Located in /public/images/icons/
 * 
 * HOW THIS COMPONENT WORKS:
 * =========================
 * 1. STATE MANAGEMENT:
 *    - formData: Stores all form field values
 *    - errors: Stores validation error messages
 *    - isSubmitting: Tracks if form is currently being submitted
 *    - submitSuccess: Tracks if submission was successful
 * 
 * 2. EVENT HANDLERS:
 *    - handleInputChange: Updates text input fields
 *    - handleRadioChange: Updates radio button selections (true/false)
 *    - handleDietaryChange: Updates dietary restriction checkboxes
 *    - handleSubmit: Sends form data to the API
 * 
 * 3. CONDITIONAL RENDERING:
 *    - Guest name field appears only if user selects "bringing a guest"
 *    - Accommodation details appear only if user needs accommodations
 *    - Success/error messages appear based on submission result
 * 
 * 4. FORM VALIDATION:
 *    - Required fields are marked with asterisks (*)
 *    - HTML5 validation (required, email, tel types)
 *    - Server-side validation via the API
 * 
 * 5. API INTEGRATION:
 *    - Submits data to POST /api/rsvps endpoint
 *    - Receives validation errors or success response
 *    - Resets form on successful submission
 * 
 * USAGE:
 * ======
 * import RSVPForm from '@/components/public/RSVP/RSVPForm';
 * 
 * <RSVPForm />
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ToastNotification, { useToast } from '@/components/public/ToastNotification';

/**
 * RSVP FORM COMPONENT
 * 
 * Main component that renders the complete RSVP form with all fields.
 * Manages form state, validation, and submission to the database.
 */
export default function RSVPForm() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * FORM DATA STATE
   * 
   * This state object holds all the form field values.
   * It mirrors the RSVP schema defined in src/models/Rsvp.js
   * 
   * Initial values:
   * - Text fields start as empty strings ('')
   * - Boolean fields start as null (not selected)
   * - dietaryRestrictions is an object with multiple boolean flags
   */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: null,
    guests: null,
    guestName: '',
    dietaryRestrictions: {
      none: false,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      nutAllergy: false,
      shellfishAllergy: false,
      other: '',
    },
    accommodations: null,
    accommodationsText: '',
    song: '',
    message: '',
  });

  /**
   * ERROR STATE
   * 
   * Stores an array of error messages from validation.
   * Displayed to the user if form submission fails.
   */
  const [errors, setErrors] = useState([]);
  
  /**
   * SUBMITTING STATE
   * 
   * Tracks whether the form is currently being submitted.
   * Used to disable the submit button and show loading state.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * SUCCESS STATE
   * 
   * Tracks whether the form was successfully submitted.
   * Used to show a success message to the user.
   */
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  /**
   * TOAST NOTIFICATION
   * 
   * Hook for managing toast notifications (success/error messages).
   */
  const { toast, showToast, hideToast } = useToast();
  
  /**
   * ROUTER
   * 
   * Next.js router for redirecting after successful form submission.
   */
  const router = useRouter();
  
  /**
   * ICON IMAGE PATH
   * 
   * Path to the icon image used for all form field labels.
   * This provides a consistent visual design across the form.
   */
  const iconImage = '/images/icons/text_heart.png';
  const iconImageMusic = '/images/icons/musicIcon.png';
  const iconImageplating = '/images/icons/platingIcon2.png';
  const iconImageEmail = '/images/icons/emailIcon.png';
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * HANDLE INPUT CHANGE
   * 
   * Updates the form data when a text input field changes.
   * This handler is used for: name, email, phone, guestName, song, accommodationsText
   * 
   * How it works:
   * 1. Extracts the field name and value from the event
   * 2. Updates formData state using the spread operator (...prev)
   * 3. Only updates the specific field that changed
   * 
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * HANDLE RADIO CHANGE
   * 
   * Updates the form data when a radio button is selected.
   * This handler is used for: attending, guests, accommodations
   * 
   * Radio buttons represent boolean choices (true/false or yes/no).
   * 
   * How it works:
   * 1. Receives the field name and boolean value (true or false)
   * 2. Updates formData state with the new value
   * 3. Special handling: If attending is set to false, also set guests to false
   * 
   * @param {string} name - The field name (e.g., 'attending')
   * @param {boolean} value - The boolean value (true or false)
   */
  const handleRadioChange = (name, value) => {
    // If user selects "not attending", automatically set default values for hidden fields
    if (name === 'attending' && value === false) {
      setFormData((prev) => ({
        ...prev,
        attending: false,
        guests: false,
        guestName: '',
        dietaryRestrictions: {
          none: true,
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          nutAllergy: false,
          shellfishAllergy: false,
          other: '',
        },
        accommodations: false,
        accommodationsText: '',
        song: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * HANDLE DIETARY CHANGE
   * 
   * Updates dietary restrictions when checkboxes or text input changes.
   * This is a special handler because dietaryRestrictions is a nested object.
   * 
   * How it works:
   * 1. Checks if the field is the 'other' text input
   * 2. For text input: updates the 'other' string value
   * 3. For checkboxes: updates the specific boolean flag
   * 4. Preserves all other dietary restriction values using spread operator
   * 
   * Example field names:
   * - 'dietaryRestrictions.vegetarian' (checkbox)
   * - 'dietaryRestrictions.other' (text input)
   * 
   * @param {Event} e - The input change event
   */
  const handleDietaryChange = (e) => {
    const { name, checked, value } = e.target;
    
    // Handle the 'other' text input separately from checkboxes
    if (name === 'dietaryRestrictions.other') {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: {
          ...prev.dietaryRestrictions,
          other: value,
        },
      }));
    } else {
      // For checkboxes, extract the restriction name (e.g., 'vegetarian')
      const restrictionName = name.replace('dietaryRestrictions.', '');
      
      // Special handling for 'none' checkbox
      if (restrictionName === 'none') {
        // If checking 'none', uncheck all other options
        if (checked) {
          setFormData((prev) => ({
            ...prev,
            dietaryRestrictions: {
              none: true,
              vegetarian: false,
              vegan: false,
              glutenFree: false,
              nutAllergy: false,
              shellfishAllergy: false,
              other: '',
            },
          }));
        } else {
          // If unchecking 'none', just update that field
          setFormData((prev) => ({
            ...prev,
            dietaryRestrictions: {
              ...prev.dietaryRestrictions,
              none: false,
            },
          }));
        }
      } else {
        // For other checkboxes, if 'none' is checked, uncheck it first
        setFormData((prev) => ({
          ...prev,
          dietaryRestrictions: {
            ...prev.dietaryRestrictions,
            none: false, // Uncheck 'none' when selecting other options
            [restrictionName]: checked,
          },
        }));
      }
    }
  };

  /**
   * HANDLE SUBMIT
   * 
   * Submits the RSVP form data to the API endpoint.
   * 
   * How it works:
   * 1. Prevents default form submission (page reload)
   * 2. Clears any previous errors
   * 3. Sets submitting state to true (disables button, shows loading)
   * 4. Sends POST request to /api/rsvps with form data as JSON
   * 5. Waits for response from the server
   * 6. If successful:
   *    - Shows success message
   *    - Resets form to initial empty state
   * 7. If failed:
   *    - Displays error messages to the user
   * 8. Finally:
   *    - Sets submitting state back to false
   * 
   * The API endpoint validates the data and saves it to MongoDB.
   * See: src/pages/api/rsvps/index.js
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    // Prevent the browser's default form submission (which would reload the page)
    e.preventDefault();
    
    // Clear any previous error messages
    setErrors([]);
    
    // Set submitting state to true (disables submit button)
    setIsSubmitting(true);

    try {
      // Check if an RSVP already exists for this email
      const checkResponse = await fetch(`/api/rsvps/check-email?email=${encodeURIComponent(formData.email)}`);
      const checkResult = await checkResponse.json();
      
      // If RSVP exists, ask user for confirmation to replace it
      if (checkResult.success && checkResult.exists) {
        const confirmed = window.confirm(
          `An RSVP has already been submitted for ${formData.email}. ` +
          `Submitting this form will replace your previous RSVP. ` +
          `Would you like to continue?`
        );
        
        // If user cancels, redirect to home
        if (!confirmed) {
          setIsSubmitting(false);
          router.push('/');
          return;
        }
        
        // If user confirms, delete the old RSVP first
        const deleteResponse = await fetch(`/api/rsvps/${checkResult.rsvp._id}`, {
          method: 'DELETE',
        });
        
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete previous RSVP');
        }
      }
      
      // Prepare submission data with defaults for hidden fields when not attending
      const submissionData = { ...formData };
      
      // If user is not attending, set default values for fields they didn't see
      if (formData.attending === false) {
        submissionData.guests = false;
        submissionData.guestName = '';
        submissionData.dietaryRestrictions = {
          none: true,
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          nutAllergy: false,
          shellfishAllergy: false,
          other: '',
        };
        submissionData.accommodations = false;
        submissionData.accommodationsText = '';
        submissionData.song = '';
      }
      
      // Send POST request to the API endpoint
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      // Parse the JSON response from the server
      const result = await response.json();

      // Check if the submission was successful
      if (result.success) {
        // Show success toast notification
        showToast('success', 'Thank you for your RSVP! Redirecting...');
        
        // Show success message to the user
        setSubmitSuccess(true);
        
        // Reset the form to its initial empty state
        setFormData({
          name: '',
          email: '',
          phone: '',
          attending: null,
          guests: null,
          guestName: '',
          dietaryRestrictions: {
            none: false,
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            nutAllergy: false,
            shellfishAllergy: false,
            other: '',
          },
          accommodations: null,
          accommodationsText: '',
          song: '',
          message: '',
        });
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        // Display validation errors from the server
        setErrors(result.errors || [result.error]);
        // Show error toast
        showToast('error', 'Please fix the errors and try again.');
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      setErrors(['Failed to submit RSVP. Please try again.']);
      // Show error toast
      showToast('error', 'Failed to submit RSVP. Please try again.');
    } finally {
      // Always set submitting back to false, whether successful or not
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">

      {/* 
        MAIN FORM
        
        All form fields are defined below.
        Fields marked with * are required.
        Some fields appear conditionally based on user selections.
      */}
      <form onSubmit={handleSubmit} className="space-y-8 text-gray-800">
        
        {/* 
          NAME FIELD
          
          Text input for guest's full name.
          Required field - user must fill this out.
        */}
        <div className="form-group ">
          <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
            <Image
              src={iconImage}
              alt="Name"
              width={24}
              height={24}
              className="object-contain"
            />
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* 
          EMAIL FIELD
          
          Email input with built-in browser validation.
          Required field - must be valid email format.
        */}
        <div className="form-group">
          <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
            <Image
              src={iconImageEmail}
              alt="Email"
              width={24}
              height={24}
              className="object-contain"
            />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
            required
          />
        </div>

        {/* 
          PHONE FIELD
          
          Telephone input for contact number.
          Required field.
        */}
        <div className="form-group">
          <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
            <Image
              src={iconImage}
              alt="Phone"
              width={24}
              height={24}
              className="object-contain"
            />
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(555) 123-4567"
            required
          />
        </div>

        {/* 
          ATTENDING RADIO BUTTONS
          
          Yes/No choice for whether guest will attend.
          Required field - user must select one option.
          Radio buttons ensure only one option can be selected.
        */}
        <div className="form-group">
          <label className="flex items-center gap-3 mb-3 text-lg font-medium text-gray-700">
            <Image
              src={iconImage}
              alt="Attending"
              width={24}
              height={24}
              className="object-contain"
            />
            Will you honor us with your presence on this special day? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 ml-9">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                checked={formData.attending === true}
                onChange={() => handleRadioChange('attending', true)}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-gray-700">Yes, I'll be there</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                checked={formData.attending === false}
                onChange={() => handleRadioChange('attending', false)}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">No, I can't make it</span>
            </label>
          </div>
        </div>

        {/* 
          GUESTS RADIO BUTTONS (CONDITIONAL)
          
          Yes/No choice for bringing additional guests.
          Only appears if user is attending (attending === true).
          Required field when visible.
          If user selects "Yes", the guest name field appears below.
        */}
        {formData.attending === true && (
        <div className="form-group">
          <label className="flex items-center gap-3 mb-3 text-lg font-medium text-gray-700">
            <Image
              src={iconImage}
              alt="Guests"
              width={24}
              height={24}
              className="object-contain"
            />
            Will you be bringing a guest? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 ml-9">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="guests"
                checked={formData.guests === true}
                onChange={() => handleRadioChange('guests', true)}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-gray-700">Yes, I'll be bringing a guest!</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="guests"
                checked={formData.guests === false}
                onChange={() => handleRadioChange('guests', false)}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">No, I'll be attending on my own.</span>
            </label>
          </div>
        </div>
        )}

        {/* 
          GUEST NAME FIELD (CONDITIONAL)
          
          This field only appears if the user selected "Yes" for bringing guests.
          This is called "conditional rendering" in React.
          
          How it works:
          - {formData.guests === true && (...)} means:
          - "If guests is true, render the content inside"
          - Otherwise, render nothing
        */}
        {formData.guests === true && (
          <div className="form-group ml-9 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
              <Image
                src={iconImage}
                alt="Guest Name"
                width={20}
                height={20}
                className="object-contain"
              />
              Kindly let us know the name of your guest <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter guest's name"
              required={formData.guests === true}
            />
          </div>
        )}

        {/* 
          DIETARY RESTRICTIONS (CONDITIONAL)
          
          Multiple checkboxes for different dietary needs.
          Optional field - user can select multiple options or none.
          Includes a text input for custom restrictions.
          Only appears if user is attending (attending === true).
        */}
        {formData.attending === true && (
        <div className="form-group">
          <label className="flex items-center gap-3 mb-3 text-lg font-medium text-gray-700">
            <Image
              src={iconImageplating}
              alt="Dietary Restrictions"
              width={24}
              height={24}
              className="object-contain"
            />
            Do you have any dietary restrictions or special preferences we should know about? <span className="text-red-500">*</span>
          </label>
          <div className="ml-9 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="dietaryRestrictions.none"
                checked={formData.dietaryRestrictions.none}
                onChange={handleDietaryChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">None</span>
            </label>
            <label className={`flex items-center gap-2 ${formData.dietaryRestrictions.none ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="dietaryRestrictions.vegetarian"
                checked={formData.dietaryRestrictions.vegetarian}
                onChange={handleDietaryChange}
                disabled={formData.dietaryRestrictions.none}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700">Vegetarian</span>
            </label>
            <label className={`flex items-center gap-2 ${formData.dietaryRestrictions.none ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="dietaryRestrictions.vegan"
                checked={formData.dietaryRestrictions.vegan}
                onChange={handleDietaryChange}
                disabled={formData.dietaryRestrictions.none}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700">Vegan</span>
            </label>
            <label className={`flex items-center gap-2 ${formData.dietaryRestrictions.none ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="dietaryRestrictions.glutenFree"
                checked={formData.dietaryRestrictions.glutenFree}
                onChange={handleDietaryChange}
                disabled={formData.dietaryRestrictions.none}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700">Gluten-Free</span>
            </label>
            <label className={`flex items-center gap-2 ${formData.dietaryRestrictions.none ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="dietaryRestrictions.nutAllergy"
                checked={formData.dietaryRestrictions.nutAllergy}
                onChange={handleDietaryChange}
                disabled={formData.dietaryRestrictions.none}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700">Nut Allergy</span>
            </label>
            <label className={`flex items-center gap-2 ${formData.dietaryRestrictions.none ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                name="dietaryRestrictions.shellfishAllergy"
                checked={formData.dietaryRestrictions.shellfishAllergy}
                onChange={handleDietaryChange}
                disabled={formData.dietaryRestrictions.none}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700">Shellfish Allergy</span>
            </label>
            {/* Text input for custom dietary restrictions */}
            <div className="mt-3">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Other (please specify)
              </label>
              <input
                type="text"
                name="dietaryRestrictions.other"
                value={formData.dietaryRestrictions.other}
                onChange={handleDietaryChange}
                disabled={formData.dietaryRestrictions.none}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                placeholder="Any other dietary restrictions"
              />
            </div>
          </div>
        </div>
        )}

        {/* 
          ACCOMMODATIONS RADIO BUTTONS (CONDITIONAL)
          
          Yes/No choice for needing special accommodations.
          Required field when visible.
          If user selects "Yes", a text area appears for details.
          Only appears if user is attending (attending === true).
        */}
        {formData.attending === true && (
        <>
          <div className="form-group">
            <label className="flex items-center gap-3 mb-3 text-lg font-medium text-gray-700">
              <Image
                src={iconImage}
                alt="Accommodations"
                width={24}
                height={24}
                className="object-contain"
              />
              Do you need accommodations? *
            </label>
            <div className="flex gap-6 ml-9">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="accommodations"
                  checked={formData.accommodations === true}
                  onChange={() => handleRadioChange('accommodations', true)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="accommodations"
                  checked={formData.accommodations === false}
                  onChange={() => handleRadioChange('accommodations', false)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* 
            ACCOMMODATIONS TEXT (CONDITIONAL)
            
            Text area for describing accommodation needs.
            Only appears if user selected "Yes" for accommodations.
            Required if accommodations is true.
          */}
          {formData.accommodations === true && (
            <div className="form-group ml-9 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
                Accommodation Details *
              </label>
              <textarea
                name="accommodationsText"
                value={formData.accommodationsText}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe your accommodation needs"
                required={formData.accommodations === true}
              />
            </div>
          )}
        </>
        )}

        {/* 
          SONG REQUEST (CONDITIONAL)
          
          Optional text input for requesting a song at the reception.
          Not required.
          Only appears if user is attending (attending === true).
        */}
        {formData.attending === true && (
        <div className="form-group">
          <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
            <Image
              src={iconImageMusic}
              alt="Song Request"
              width={24}
              height={24}
              className="object-contain"
            />
            Tell us a song that will get you dancing - we'll try to play it for you!
          </label>
          <input
            type="text"
            name="song"
            value={formData.song}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Request a song for the reception"
          />
        </div>
        )}

        {/* 
          MESSAGE
          
          Optional textarea for guests to leave a message for the couple.
          Not required.
        */}
        <div className="form-group">
          <label className="flex items-center gap-3 mb-2 text-lg font-medium text-gray-700">
            <Image
              src={iconImage}
              alt="Message"
              width={24}
              height={24}
              className="object-contain"
            />
            Leave us a message or share your excitement!
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts, well wishes, or anything you'd like to tell us..."
          />
        </div>

        {/* 
          SUBMIT BUTTON
          
          Submits the form data to the API.
          Disabled while form is submitting to prevent duplicate submissions.
          Shows "Submitting..." text while processing.
        */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          </button>
        </div>
      </form>
      
      {/* Toast Notification */}
      <ToastNotification
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
        duration={5000}
      />
    </div>
  );
}

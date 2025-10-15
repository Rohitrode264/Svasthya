import React, { useEffect, useState } from "react";
import { AlertOctagonIcon, Trash2, Send, UserPlus } from "lucide-react";
import axios from "axios";
import { MainWrapper } from "../../component/Wrapper/MainWrapper";
import { Button } from "../../component/Button";
import { Input } from "../../component/Input";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";

export const CareAlert: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relation: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const { userId } = useParams();
  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/contacts/${userId}`, {
        headers: { Authorization: token },
      });
      setContacts(res.data.contacts || []);
    } catch (err) {
      setFeedback({ type: "error", text: "Failed to load contacts." });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async () => {
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      setFeedback({ type: "error", text: "Please provide at least a name and phone or email." });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/contacts/`,
        { userId, ...newContact },
        { headers: { Authorization: token } }
      );

      setContacts((prev) => [...prev, res.data.newContact]);
      setNewContact({ name: "", phone: "", email: "", relation: "" });
      setShowForm(false);
      setFeedback({ type: "success", text: "New contact added successfully!" });
    } catch (err) {
      setFeedback({ type: "error", text: "Failed to add contact." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/contacts/${id}`, {
        headers: { Authorization: token },
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setFeedback({ type: "info", text: "Contact deleted successfully." });
    } catch (err) {
      setFeedback({ type: "error", text: "Failed to delete contact." });
    }
  };

  const handleSendSOS = async () => {
    if (!message.trim()) {
      setFeedback({ type: "error", text: "Please write a message to send." });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/contacts/send`,
        { userId, message },
        { headers: { Authorization: token } }
      );
      setFeedback({ type: "success", text: "SOS message sent to all emergency contacts!" });
      setMessage("");
    } catch (err) {
      setFeedback({ type: "error", text: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainWrapper>
      <div className="p-2 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="flex items-center text-2xl font-semibold text-gray-800 space-x-2">
            <AlertOctagonIcon className="w-6 h-6 text-lime-600" />
            <span>Care Alert</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-2/3">
  <Input
    type="text"
    placeholder="Enter your emergency message..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
  />

  <Button
    onClick={handleSendSOS}
    disabled={loading || contacts.length === 0}
    icon={<Send size={18} />}
    variant="secondary"
    size="sm"
    className="whitespace-nowrap flex items-center justify-center px-4 py-2"
  >
    Send Alert
  </Button>
</div>


          <Button
            variant="outline"
            size="sm"
            icon={<UserPlus />}
            onClick={() => setShowForm((p) => !p)}
          >
            {showForm ? "Cancel" : "Add Member"}
          </Button>
        </div>

        {feedback && (
          <div
            className={`transition-all duration-300 text-sm rounded-md px-4 py-2 ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : feedback.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {showForm && (
          <div className="p-4 border border-gray-200 bg-white rounded-lg shadow-sm space-y-3 animate-fadeIn">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Relation (e.g. Mom, Friend)"
                value={newContact.relation}
                onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
              />
            </div>
            <Button
              onClick={handleAddContact}
              disabled={loading}
              variant="primary"
              size="sm"
            >
              Save Contact
            </Button>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Saved Emergency Contacts
          </h2>

          {contacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No contacts added yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {contact.relation || "No relation"}
                    </p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainWrapper>
  );
};

export default CareAlert;

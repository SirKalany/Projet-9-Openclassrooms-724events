import { fireEvent, render, screen } from "@testing-library/react";
import { DataProvider, api } from "../../contexts/DataContext";
import Home from "./index";
import EventCard from "../../components/EventCard";

const mockData = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
    },
    {
      id: 2,
      type: "forum",
      date: "2022-04-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
    },
  ],
  focus: [
    {
      id: 3,
      date: "2023-01-01T00:00:00.000Z",
      title: "Evénement focus exemple",
      cover: "/images/focus.png",
      type: "focus",
    },
  ],
};

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  beforeEach(() => {
    // Mock la fonction api.loadData pour retourner nos données complètes
    api.loadData = jest.fn().mockResolvedValue(mockData);
  });

  it("a list of events is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    const conferenceElems = await screen.findAllByText(
      /Conférence #productCON/i
    );
    expect(conferenceElems.length).toBeGreaterThan(0);

    const forumElems = await screen.findAllByText(/Forum #productCON/i);
    expect(forumElems.length).toBeGreaterThan(0);

    // Optionnel: vérifier que les images des events sont présentes
    expect(
      screen
        .getAllByRole("img")
        .some((img) => img.src.includes("stem-list-EVgsAbL51Rk-unsplash.png"))
    ).toBe(true);
  });

  it("a list a people is displayed", async () => {
    render(<Home />);

    await screen.findByText("Samira");
    await screen.findByText("Jean-baptiste");
    await screen.findByText("Alice");
    await screen.findByText("Luís");
    await screen.findByText("Christine");
    await screen.findByText("Isabelle");

    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("Directeur marketing")).toBeInTheDocument();
    expect(screen.getByText("CXO")).toBeInTheDocument();
    expect(screen.getByText("Animateur")).toBeInTheDocument();
    expect(screen.getByText("VP animation")).toBeInTheDocument();
    expect(screen.getByText("VP communication")).toBeInTheDocument();
  });

  it("a footer is displayed", () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    expect(
      screen.getByText(/Notre derni[èeé]re prestation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Contactez-nous/i)).toBeInTheDocument();
    expect(screen.getByText(/45 avenue de la République/i)).toBeInTheDocument();
    expect(screen.getByText(/01 23 45 67 89/i)).toBeInTheDocument();
    expect(screen.getByText(/contact@724events\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Une agence événementielle/i)).toBeInTheDocument();
  });

  it("an event card, with the last event, is displayed", () => {
    const event = {
      title: "Dernier événement simple",
      cover: "http://image.mock/simple.jpg",
      date: new Date("2023-05-17"),
      label: "boom",
    };

    render(
      <EventCard
        imageSrc={event.cover}
        title={event.title}
        date={event.date}
        label={event.label}
        small
      />
    );

    expect(screen.getByText(event.title)).toBeInTheDocument();

    const image = screen.getByTestId("card-image-testid");
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(event.cover);

    expect(screen.getByText(event.label)).toBeInTheDocument();
  });
});

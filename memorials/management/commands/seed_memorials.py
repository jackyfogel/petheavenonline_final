import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils.text import slugify
from memorials.models import Memorial, MemorialTrait, TimelineMilestone


PETS = {
    'Dog': {
        'names': ['Buddy', 'Max', 'Charlie', 'Buster', 'Rocky', 'Bella', 'Lucy', 'Sadie',
                  'Molly', 'Bear', 'Duke', 'Cooper', 'Zeus', 'Harley', 'Rosie', 'Archie',
                  'Coco', 'Bruno', 'Rex', 'Penny'],
        'breeds': ['Golden Retriever', 'Labrador', 'German Shepherd', 'Beagle', 'Poodle',
                   'Bulldog', 'Dachshund', 'Husky', 'Border Collie', 'Shih Tzu', 'Boxer',
                   'Cavalier King Charles Spaniel', 'Cocker Spaniel'],
    },
    'Cat': {
        'names': ['Luna', 'Mittens', 'Whiskers', 'Shadow', 'Tiger', 'Cleo', 'Smokey',
                  'Patches', 'Felix', 'Ginger', 'Misty', 'Socks', 'Pearl', 'Jasper',
                  'Willow', 'Maple', 'Oliver', 'Pumpkin', 'Mochi', 'Biscuit'],
        'breeds': ['Domestic Shorthair', 'Persian', 'Siamese', 'Maine Coon', 'Ragdoll',
                   'Bengal', 'Tabby', 'Calico', 'Russian Blue', 'British Shorthair',
                   'Scottish Fold', 'Abyssinian'],
    },
    'Bird': {
        'names': ['Tweety', 'Polly', 'Kiwi', 'Mango', 'Sky', 'Sunny', 'Rio', 'Pepper',
                  'Cosmo', 'Pippin', 'Peaches', 'Pebble'],
        'breeds': ['Budgerigar', 'Cockatiel', 'African Grey', 'Lovebird', 'Canary',
                   'Parakeet', 'Conure', 'Cockatoo'],
    },
    'Rabbit': {
        'names': ['Thumper', 'Cotton', 'Clover', 'Nibbles', 'Floppy', 'Snowball',
                  'Caramel', 'Hazel', 'Peanut', 'Poppy'],
        'breeds': ['Holland Lop', 'Mini Rex', 'Flemish Giant', 'Dutch', 'Lionhead',
                   'Angora', 'Rex'],
    },
}

EPITAPHS = [
    "Loyal beyond measure.",
    "She filled every room with light.",
    "A gentleman until the very end.",
    "Forever chasing sunbeams.",
    "Small paws, enormous heart.",
    "He walked quietly beside us.",
    "Gentle and curious always.",
    "Brave, warm, and true.",
    "She taught us how to rest.",
    "Steadfast to the last.",
    "Too bright, too brief.",
    "A long life, well and fully lived.",
    "Always running toward the waves.",
    "Free and joyful every single day.",
    "The best of us.",
    "Love in its purest form.",
    "Left paw prints on every heart.",
    "Forever our sunshine.",
    "A soul too sweet for this world.",
    "Remembered in every quiet moment.",
]

STORIES = [
    "{name} came into our lives on a rainy afternoon and never left our side. Every morning began with a wagging tail and every evening ended with warmth beside us.",
    "{name} was small in size but enormous in spirit. She had a way of finding whoever needed her most and curling up beside them without being asked.",
    "He was the kind of companion who made every ordinary day feel like something worth remembering. Thirteen years was not enough, but we are grateful for every one.",
    "From the moment we brought {name} home, she claimed every soft surface in the house as her own. She lived fully and loved deeply, and we miss her every single day.",
    "{name} was a quiet soul who asked for very little and gave so much in return. His presence was a calm in every storm we faced together.",
    "She had a talent for mischief and an even greater talent for forgiveness. The years flew by in what felt like moments, and now the house is too still without her.",
    "{name} chose us as much as we chose him, and we were better for it. A steady, faithful friend who never wavered through any of life's changes.",
    "She was endlessly curious about the world and endlessly patient with the people in it. We will hear {name} in every rustling leaf and every quiet afternoon.",
    "{name} had a big personality in a small body. He made every room feel more alive and every silence feel too quiet after he was gone.",
    "She arrived as a tiny rescue and grew into the heart of our family. We said goodbye too soon, but she always knew she was loved.",
    "{name} was adventurous and bold, always the first to explore and the last to leave. The house still feels like his in all the best ways.",
    "She had the softest eyes and a presence that made every morning better. Eleven years of days were made richer simply by having {name} in them.",
    "He was our shadow, our alarm clock, and our greatest comfort. We didn't know how much of our routine revolved around {name} until he was gone.",
    "{name} was gentle with everyone she met and fierce in her loyalty to the ones she loved. A rare and beautiful soul we will never forget.",
    "He came to us as a rescue and repaid every kindness a hundredfold. Years of unconditional love that changed us for the better.",
]

OWNER_NAMES = [
    "The Smith Family", "The Johnson Family", "The Williams Family", "The Brown Family",
    "The Jones Family", "The Garcia Family", "The Miller Family", "The Davis Family",
    "The Rodriguez Family", "The Martinez Family", "The Hernandez Family", "The Lopez Family",
    "The Wilson Family", "The Anderson Family", "The Thomas Family", "The Taylor Family",
    "The Moore Family", "The Jackson Family", "The Martin Family", "The Lee Family",
    "The Perez Family", "The Thompson Family", "The White Family", "The Harris Family",
    "The Sanchez Family", "The Clark Family", "The Lewis Family", "The Robinson Family",
]

TRAITS = [
    "Playful", "Gentle", "Loyal", "Mischievous", "Curious", "Affectionate", "Brave",
    "Stubborn", "Independent", "Energetic", "Calm", "Protective", "Clever", "Shy",
    "Social", "Adventurous", "Graceful", "Vocal", "Cuddly", "Determined", "Silly",
    "Sweet", "Fierce", "Wise", "Lazy", "Nosy",
]

MILESTONE_FAVORITES = [
    "First trip to the park",
    "Moved to a new home and made it theirs",
    "Survived a serious illness and came back stronger",
    "Met their best animal friend",
    "First camping trip to the mountains",
    "Won everyone's heart at the neighborhood gathering",
    "Discovered an unstoppable love of the outdoors",
    "Learned a favorite trick that always drew a crowd",
    "Welcomed a new baby into the family",
    "Celebrated ten wonderful years together",
    "Went on their first beach trip",
    "Made a full recovery after a health scare",
]


def random_dates(rng):
    """Returns (birth_date, passing_date) with a 5–15 year lifespan, passing between 2020–2025."""
    passing_year = rng.randint(2020, 2025)
    passing_month = rng.randint(1, 12)
    passing_day = rng.randint(1, 28)
    passing = date(passing_year, passing_month, passing_day)
    lifespan_days = rng.randint(5 * 365, 15 * 365)
    birth = passing - timedelta(days=lifespan_days)
    return birth, passing


class Command(BaseCommand):
    help = 'Seed 50 fake approved pet memorials for testing'

    def handle(self, *args, **options):
        user = User.objects.filter(is_superuser=True).first() or User.objects.first()
        if not user:
            self.stderr.write("No users found. Create a superuser first.")
            return

        rng = random.Random(42)  # fixed seed for reproducibility
        existing_slugs = set(Memorial.objects.values_list('slug', flat=True))
        created = 0

        for i in range(50):
            species = rng.choice(list(PETS.keys()))
            pet_data = PETS[species]
            name = rng.choice(pet_data['names'])
            breed = rng.choice(pet_data['breeds'])
            birth, passing = random_dates(rng)
            epitaph = EPITAPHS[i % len(EPITAPHS)]
            story_template = rng.choice(STORIES)
            story = story_template.format(name=name)
            owner = rng.choice(OWNER_NAMES)

            base_slug = slugify(f"{name}-{owner.split()[1].lower()}")
            slug = base_slug
            counter = 1
            while slug in existing_slugs or Memorial.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            existing_slugs.add(slug)

            memorial = Memorial.objects.create(
                user=user,
                slug=slug,
                pet_name=name,
                species=species,
                breed=breed,
                birth_date=birth,
                passing_date=passing,
                photo='',
                epitaph=epitaph,
                story=story,
                owner_name=owner,
                status='approved',
            )

            traits = rng.sample(TRAITS, rng.randint(2, 4))
            for trait in traits:
                MemorialTrait.objects.create(memorial=memorial, trait=trait)

            milestones = [
                (str(birth.year), f"Born into the world"),
                (str(birth.year + 1) if birth.year + 1 < passing.year else str(birth.year), f"Joined {owner}"),
                (str(rng.randint(birth.year + 2, passing.year - 1)) if passing.year - birth.year > 3 else str(birth.year + 1), rng.choice(MILESTONE_FAVORITES)),
                (str(passing.year), f"Passed away peacefully, surrounded by love"),
            ]
            for order, (milestone_date, desc) in enumerate(milestones):
                TimelineMilestone.objects.create(
                    memorial=memorial, date=milestone_date, description=desc, order=order
                )

            created += 1
            self.stdout.write(f"  {created:>2}. {name} ({species}) — {slug}")

        self.stdout.write(self.style.SUCCESS(f"\n{created} memorials seeded successfully."))

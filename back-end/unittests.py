from unittest import main, TestCase

class UnitTests(TestCase):
    def setUp(self):
        pass
    
    # Make sure that all test methods start with test_
    def test_always_right(self):
        self.assertEqual(1, 1)

if __name__ == '__main__':
    main()

-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2023 at 01:16 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wowtrader`
--

-- --------------------------------------------------------

--
-- Table structure for table `august`
--

CREATE TABLE `august` (
  `id` int(2) DEFAULT NULL,
  `item` varchar(38) DEFAULT NULL,
  `tendies` int(3) DEFAULT NULL,
  `description` varchar(25) DEFAULT NULL,
  `image` varchar(36) DEFAULT NULL,
  `wowhead` varchar(72) DEFAULT NULL,
  `wowheadid` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `august`
--

INSERT INTO `august` (`id`, `item`, `tendies`, `description`, `image`, `wowhead`, `wowheadid`) VALUES
(1, 'Spirit of Competition', 650, 'Item Type: Pet', 'Spirit of Competition', 'https://www.wowhead.com/npc=27217/spirit-of-competition', 27217),
(2, 'Ethereal Transmogrifier', 500, 'Item Type: Toy', 'Ethereal Transmogrifier', 'https://www.wowhead.com/item=206268/ethereal-transmogrifier', 206268),
(3, 'Alabaster Thunderwing', 650, 'Item Type: HordeMount', 'Alabaster Thunderwing', 'https://www.wowhead.com/spell=302362/alabaster-thunderwing', 302362),
(4, 'Alabaster Stormtalon', 650, 'Item Type: AllianceMount', 'Alabaster Stormtalon', 'https://www.wowhead.com/spell=302361/alabaster-stormtalon', 302361),
(5, 'Ancestral Clefthoof', 650, 'Item Type: Mount', 'Ancestral Clefthoof', 'https://www.wowhead.com/item=207821/ancestral-clefthoof', 207821),
(6, 'City Guard Heater Shield', 50, 'Item Type: Shield', 'City Guard Heater Shield', 'https://www.wowhead.com/item=190870/city-guard-heater-shield', 190870),
(7, 'Grunt’s Buckler', 50, 'Item Type: Sheild', 'Grunts Buckler', 'https://www.wowhead.com/item=190871/grunts-buckler', 190871),
(8, 'Queen’s Conservatory Ball Gloves', 100, 'Item Type: Gloves', 'Queens Conservatory Ball Gloves', 'https://www.wowhead.com/item=208040/queens-conservatory-ball-gloves', 208040),
(9, 'Ember Court Soiree Gloves', 100, 'Item Type: Gloves', 'Ember Court Soiree Gloves', 'https://www.wowhead.com/item=208039/ember-court-soiree-gloves', 208039),
(10, 'Ensemble: Vagabond’s Azure Threads', 100, 'Item Type: Head and Cloak', 'Ensemble Vagabonds Azure Threads', 'https://www.wowhead.com/item=190576/ensemble-vagabonds-azure-threads', 190576),
(11, 'Ensemble: Wanderer’s Azure Trappings', 100, 'Item Type: Head and Cloak', 'Ensemble Wanderers Azure Trappings', 'https://www.wowhead.com/item=190577/ensemble-wanderers-azure-trappings', 190577),
(12, 'Ensemble: Vagabond’s Crimson Threads', 100, 'Item Type: Head and Cloak', 'Ensemble Vagabonds Crimson Threads', 'https://www.wowhead.com/item=190851/ensemble-vagabonds-crimson-threads', 190851),
(13, 'Ensemble: Wanderer’s Crimson Trappings', 100, 'Item Type: Head and Cloak', 'Ensemble Wanderers Crimson Trappings', 'https://www.wowhead.com/item=190850/ensemble-wanderers-crimson-trappings', 190850),
(14, 'Azure Scalesworn Longbow', 200, 'Item Type: Bow', 'Azure Scalesworn Longbow', 'https://www.wowhead.com/item=190071/azure-scalesworn-longbow', 190071),
(15, 'Shard of Frozen Secrets', 200, 'Item Type: 1-Hand Dagger', 'Shard of Frozen Secrets', 'https://www.wowhead.com/item=190143/shard-of-frozen-secrets', 190143),
(16, 'Azure Nexus Crescent', 225, 'Item Type: 2-Hand Axe', 'Azure Nexus Crescent', 'https://www.wowhead.com/item=190812/azure-nexus-crescent', 190812),
(17, 'Crimson Nexus Crescent', 225, 'Item Type: 2-Hand Axe', 'Crimson Nexus Crescent', 'https://www.wowhead.com/item=190438/crimson-nexus-crescent', 190438),
(18, 'Aquamarine Felfire Bulwark', 400, 'Item Type: Shield', 'Aquamarine Felfire Bulwark', 'https://www.wowhead.com/item=207957/aquamarine-felfire-bulwark', 207957),
(19, 'Aquamarine Felfire Splitblade', 400, 'Item Type: 1-Hand Sword', 'Aquamarine Felfire Splitblade', 'https://www.wowhead.com/item=207959/aquamarine-felfire-splitblade', 207959),
(20, 'Ruby Felfire Bulwark', 400, 'Item Type: Shield', 'Ruby Felfire Bulwark', 'https://www.wowhead.com/item=190910/ruby-felfire-bulwark', 190910),
(21, 'Ruby Felfire Splitblade', 400, 'Item Type: 1-Hand Sword', 'Ruby Felfire Splitblade', 'https://www.wowhead.com/item=190909/ruby-felfire-splitblade', 190909),
(22, 'Crown of Eternal Winter', 400, 'Item Type: Head', 'Crown of Eternal Winter', 'https://www.wowhead.com/item=95475/crown-of-eternal-winter', 95475),
(23, 'Hood of Hungering Darkness', 400, 'Item Type: Head', 'Hood of Hungering Darkness', 'https://www.wowhead.com/item=97213/hood-of-hungering-darkness', 97213),
(24, 'Blade of Brutal Sacrifice', 400, 'Item Type: 1-Hand Dagger', 'Blade of Brutal Sacrifice', 'https://www.wowhead.com/item=190078/blade-of-brutal-sacrifice', 190078),
(25, 'Fury of the Firelord', 750, 'Item Type: 1-Hand Mace', 'Fury of the Firelord', 'https://www.wowhead.com/item=189898/fury-of-the-firelord', 189898);

-- --------------------------------------------------------

--
-- Table structure for table `july`
--

CREATE TABLE `july` (
  `Item` varchar(37) DEFAULT NULL,
  `Tendies` int(3) DEFAULT NULL,
  `Description` varchar(52) DEFAULT NULL,
  `IMG` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `july`
--

INSERT INTO `july` (`Item`, `Tendies`, `Description`, `IMG`) VALUES
('Spectral Tiger Cub', 750, 'Battle Pet - formerly TCG item', 'IMG'),
('Tyrael\'s Charger', 900, 'Mount - Formerly from Shop/Promotion', 'IMG'),
('Reins of the Felcrystal Scorpion', 900, 'Mount - recolor of Reins of the Amber Scorpion', 'IMG'),
('Fabulously Flashy Finery', 50, 'Shirt Transmog', 'IMG'),
('Primeval Basher', 50, '1H Mace Transmog', 'IMG'),
('Polished Shortsword', 75, '1H Sword Transmog', 'IMG'),
('Silvered Warcloak', 75, 'Cloak Transmog', 'IMG'),
('Ensemble: Vagabond\'s Violet Threads', 100, 'Hood and Cloak Transmog', 'IMG'),
('Ensemble: Wanderer\'s Violet Trappings', 100, 'Hood and Cloak Transmog', 'IMG'),
('Fists of Polar Fury', 175, 'Fist Weapon Transmog - Recolor of Pride', 'IMG'),
('Sinister Fel Staff', 150, 'Staff Transmog - Gul\'dan\'s Walking Stick', 'IMG'),
('Mephistroth\'s Razor', 200, '1H Sword Transmog', 'IMG'),
('Helm of the Fierce', 225, 'Helm Transmog - Lost Vikings Appearancel', 'IMG'),
('Filigreed Lion\'s Maw', 250, 'Shield Transmog - Intended for CoT', 'IMG'),
('Aldori War Mace', 500, '2H Mace Transmog', 'IMG'),
('Antoran Felspire', 600, 'Staff Transmog', 'IMG'),
('Conquest', 600, '2H Sword Transmog - Recolor of Armageddon', 'IMG'),
('Ensemble: Sylvan Stalker\'s Leathers', 750, 'Transmog Ensemble - Green Recolor of PvP Legion Sets', 'IMG');

-- --------------------------------------------------------

--
-- Table structure for table `september`
--

CREATE TABLE `september` (
  `id` int(2) DEFAULT NULL,
  `item` varchar(40) DEFAULT NULL,
  `tendies` int(3) DEFAULT NULL,
  `description` varchar(129) DEFAULT NULL,
  `image` varchar(38) DEFAULT NULL,
  `wowhead` varchar(75) DEFAULT NULL,
  `wowheadid` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `september`
--

INSERT INTO `september` (`id`, `item`, `tendies`, `description`, `image`, `wowhead`, `wowheadid`) VALUES
(1, 'Plate of the Light Avenger', 450, 'Item Type: Head, Shoulder Waist', 'Plate of the Light Avenger', 'https://www.wowhead.com/item=208176/plate-of-the-light-avenger', '208176'),
(2, 'Armaments of the Light Avenger', 250, 'Item Type: Hammer of the Light Avenger (2-Hand Mace), Kite of the Light Avenger (Shield), Club of the Light Avenger (1-Hand Mace)', 'Armaments of the Light Avenger', 'https://www.wowhead.com/item=208177/armaments-of-the-light-avenger', '208177'),
(3, 'Secrets of the Unnamed Cult', 500, 'Item Type: Scepter of the Unnamed Cult (1-Hand Mace), Libram of the Unnamed Cult (Off-Hand), Staff of the Unnamed Cult (Staff)', 'Secrets of the Unnamed Cult', 'https://www.wowhead.com/item=208178/secrets-of-the-unnamed-cult', '208178'),
(4, 'Blood Onyx Uniform', 450, 'Item Type: Head, Shoulder Waist', 'Blood Onyx Uniform', 'https://www.wowhead.com/item=208405/blood-onyx-uniform', '208405'),
(5, 'Blood Onyx Blades', 500, 'Item Type: Blood Onyx Shortblade (1-Hand Sword), Blood Onyx Serrated Edge (Dagger), Blood Onyx Impaler (Dagger)', 'Blood Onyx Blades', 'https://www.wowhead.com/item=208179/blood-onyx-blades', '208179'),
(6, 'Slyvy', 650, 'Item Type: Pet', 'Slyvy', 'https://www.wowhead.com/item=208045/slyvy', '208045'),
(7, 'Gently-Used Cleaver', 50, 'Item Type: 1-Hand Sword', 'GentlyUsed Cleaver', 'https://www.wowhead.com/item=190698/gently-used-cleaver', '190698'),
(8, 'Gorian Mining Pick', 50, 'Item Type: Horde Mining Tool', 'Gorian Mining Pick', 'https://www.wowhead.com/item=190699/gorian-mining-pick', '190699'),
(9, 'Watchman’s Flare', 100, 'Item Type: Off-Hand', 'Watchmans Flare', 'https://www.wowhead.com/item=189895/watchmans-flare', '189895'),
(10, 'Ensemble: Wanderer’s Sunny Trappings', 100, 'Item Type: Head and Cloak', 'Ensemble Wanderers Sunny Trappings', 'https://www.wowhead.com/item=206332/ensemble-wanderers-sunny-trappings', '206332'),
(11, 'Ensemble: Vagabond’s Sunny Threads', 100, 'Item Type: Head and Cloak', 'Ensemble Vagabonds Sunny Threads', 'https://www.wowhead.com/item=206321/ensemble-vagabonds-sunny-threads', '206321'),
(12, 'Burgundy Cap', 150, 'Item Type: Head', 'Burgundy Cap', 'https://www.wowhead.com/item=208148/burgundy-cap', '208148'),
(13, 'Yellow Tweed Cap', 150, 'Item Type: Head', 'Yellow Tweed Cap', 'https://www.wowhead.com/item=208147/yellow-tweed-cap', '208147'),
(14, 'Dread Admiral’s Bicorne', 175, 'Item Type: Head', 'Dread Admirals Bicorne', 'https://www.wowhead.com/item=189882/dread-admirals-bicorne', '189882'),
(15, 'Irontide’s Raider’s Bicorne', 175, 'Item Type: Head', 'Irontides Raiders Bicorne', 'https://www.wowhead.com/item=190144/irontide-raiders-bicorne', '190144'),
(16, 'Ancestral Skychaser’s Totem', 250, 'Item Type: Cloak/Back', 'Ancestral Skychasers Totem', 'https://www.wowhead.com/item=190712/ancestral-skychaser-totem', '190712'),
(17, 'Ancestral Stonehoof Totem', 250, 'Item Type: Cloak/Back', 'Ancestral Stonehoof Totem', 'https://www.wowhead.com/item=190693/ancestral-stonehoof-totem', '190693'),
(18, 'Homebrewer’s Sampling Crest', 500, 'Item Type: Cloak', 'Homebrewers Sampling Crest', 'https://www.wowhead.com/item=208423/homebrewers-sampling-crest', '208423'),
(19, 'Ensemble: Swashbuckling Bucaneer’s Slops', 650, 'Item Type: Chest, Waist, Legs, Feet', 'Ensemble Swashbuckling Bucaneers Slops', 'https://www.wowhead.com/item=190799/ensemble-swashbuckling-buccaneers-slops', '190799'),
(20, 'Trusty Treasure Trove', 750, 'Item Type: Cloak/Back', 'Trusty Treasure Trove', 'https://www.wowhead.com/item=190155/trusty-treasure-trove', '190155'),
(21, 'High Scholar\'s Grand Staff', 500, 'Item Type: Staff', 'High Scholars Grand Staff', 'NA', ''),
(22, 'Silks of the Unnamed Cult', 450, 'Item Type: Head, Shoulder Waist', 'Silks of the Unnamed Cult', 'https://www.wowhead.com/item=208400/silks-of-the-unnamed-cult', '208400');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

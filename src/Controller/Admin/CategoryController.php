<?php

namespace App\Controller\Admin;

use App\Entity\Pictogram;
use App\Entity\Category;
use App\Entity\Therapist;
use App\Form\SearchType;
use App\Classe\Search;
use App\Entity\SubCategory;
use App\Form\CreateCategoryType;
use App\Form\CreatePictogramType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PictogramRepository;
use App\Repository\CategoryRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;


Class CategoryController extends AbstractController
{
    /**
     * @Route("admin/category")
     */
    /**
     * @var CategoryRepository
     */
    private $repository;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(CategoryRepository $repository, EntityManagerInterface $em)
    {
        $this->repository = $repository;
        $this->em = $em;
    }

    /**
     * @Route("admin/category", name="category")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index(Request $request): Response
    {
        $search = new Search(); //on instancie une nouvelle recherche
        $form = $this->createForm(SearchType::class, $search);// formulaire de recherche
        $form->handleRequest($request);
        $therapist = $this->getUser();// On récupère l'utilisateur de la session en cours

        if ($form->isSubmitted() && $form->isValid()) { //si le form est soumis et valid
            $pict = $this->em->getRepository(Pictogram::class)->findWithSearch($search);// fonction findWhithSearch
            if(empty ($pict)){//si pas de picto trouvé
                $this->addFlash('alert', 'Désolé, nous ne trouvons pas de pictogramme correspondant à votre saisie.');
               return $this->redirectToRoute('category');
            }else{
                foreach ($pict as $picts) {// renvoie tous les pictogrammes
                    $categorieId[]= $picts->getCategory();// récupère la catégorie
                    $categories = $this->repository->findByIds($categorieId);// range par id
                }
            }
        } else {
            $categories = $this->repository->findAll();// récupère toutes les catégories
            $pict = $this->em->getRepository(Pictogram::class)->findAll();// récupère tous les picto
            $subcategories = $this->em->getRepository(SubCategory::class)->findAll();// récupère tous les sous-catégories
        }

        return $this->render('category/index.html.twig', [
            'form' => $form->createView(),
            'categories'=> $categories,
            'pict' => $pict,
            'subcategory' => $subcategories,
            'therapist'=>$therapist,

        ]);
    }
    /**
     * @Route("admin/newCategory", name="newCategory")
     * @IsGranted("ROLE_SUPER_ADMIN")
     */
    public function addCategory (Request $request): Response
    {
 
        $category = new Category();
        $form = $this->createForm(CreateCategoryType::class, $category);
        $form->handleRequest($request);

        $therapistId=$this->em->getRepository(Therapist::class)->find($this->getUser()->getId());
        //$category->setTherapist($therapistId);

        if ($form->isSubmitted() && $form->isValid()) {
            $category = $form->getData();
            $this->em->persist($category);
            $this->em->flush();
            $this->addFlash('success', 'Catégorie créé avec succès');
            return $this->redirectToRoute('category');
        }

        return $this->render('category/createCategory.html.twig', [
            'category' => $category,
            'form' => $form->createView()
        ]);
    }
    /**
     * @Route("admin/newPictogram", name="newPictogram")
     * @IsGranted("ROLE_SUPER_ADMIN")
     */
    public function addPictogram(Request $request): Response
    {
        $pictogram = new Pictogram();
        $form = $this->createForm(CreatePictogramType::class, $pictogram);
        $form->handleRequest($request);

        $therapistId=$this->em->getRepository(Therapist::class)->find($this->getUser()->getId());
        //$pictogram->setTherapist($therapistId);

        if ($form->isSubmitted() && $form->isValid()) {
            $category = $form->get('category')->getData();
            $subcategory = $form->get('subcategory_id')->getData();

            if ( $category  && $subcategory) {
                $this->addFlash('echec', 'Ne peut avoir qu\'une catégorie ou une sous-catégorie');
                return $this->redirectToRoute('newPictogram');
            } else if (!$category && !$subcategory) {
                $this->addFlash('echec', 'Doit posséder une catégorie ou une sous-catégorie');
                return $this->redirectToRoute('newPictogram');
            } else {
                $pictogram = $form->getData();
                $this->em->persist($pictogram);
                $this->em->flush();
                $this->addFlash('success', 'Pictogramme créé avec succès');
                return $this->redirectToRoute('category');
            }
        }
        
        return $this->render('category/createPictogram.html.twig', [
            'pictogram' => $pictogram,
            'form' => $form->createView()
        ]);
    }
    /**
     * @Route("/admin/category/{id}", name="admin.category.delete", methods="DELETE")
     * @param Category $category
     * @return Response
     */
    public function delete(Category $category, Request $request, PictogramRepository $pictogramRepository)
    {

        $id = $category->getId();
        $pictogram = $pictogramRepository->findByCategory($id);


        if (!empty ($pictogram)) {
            $this->addFlash('alert', "Des pictogrammes sont déjà associés à cette catégorie. Supprimez d'abord les pictogrammes.");
        } else {

            if ($this->isCsrfTokenValid('delete' . $category->getId(), $request->get('_token'))) {
                $this->em->remove($category);
                $this->em->flush();
                $this->addFlash('success', 'Catégorie supprimée avec succès');
                return $this->redirectToRoute('category');
            }
        }
        return $this->redirectToRoute('category');
    }


    /**
     * @Route("/admin/pictogram/{id}", name="admin.pictogram.delete", methods="DELETE")
     * @param Pictogram $pictogram
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deletePicto(Pictogram $pictogram, Request $request) {
        if ($this->isCsrfTokenValid('delete1' . $pictogram->getId(), $request->get('_token'))) {
            $this->em->remove($pictogram);
            $this->em->flush();
            $this->addFlash('success', 'Pictogramme supprimé avec succès');
        }
        return $this->redirectToRoute('category');
    }

}